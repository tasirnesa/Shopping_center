import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) { }

  // ───── Suppliers ─────

  async getSuppliers(orgId: string) {
    return this.prisma.supplier.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async createSupplier(orgId: string, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: { ...dto, organizationId: orgId },
    });
  }

  // ───── Purchases / Goods Receipt ─────

  async getPurchases(orgId: string) {
    return this.prisma.purchase.findMany({
      where: { organizationId: orgId },
      include: {
        supplier: true,
        branch: true,
        details: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPurchase(orgId: string, dto: CreatePurchaseDto) {
    const totalAmount = dto.details.reduce(
      (sum, d) => sum + d.quantity * d.cost,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          organizationId: orgId,
          branchId: dto.branchId,
          supplierId: dto.supplierId,
          totalAmount,
          details: {
            create: dto.details.map((d) => ({
              productId: d.productId,
              quantity: d.quantity,
              cost: d.cost,
            })),
          },
        },
        include: { details: true },
      });

      for (const detail of dto.details) {
        await this.upsertStockBalance(
          tx,
          dto.branchId,
          detail.productId,
          detail.quantity,
        );

        await tx.inventoryTransaction.create({
          data: {
            productId: detail.productId,
            branchId: dto.branchId,
            type: 'IN',
            quantity: detail.quantity,
            reference: `Purchase:${purchase.id}`,
          },
        });
      }

      return purchase;
    });
  }

  // ───── Stock Balance ─────

  async getStockBalance(orgId: string, branchId?: string) {
    const where: any = {};
    if (branchId) {
      where.branchId = branchId;
    } else {
      // Scope to org's branches
      where.branch = { organizationId: orgId };
    }

    return this.prisma.stockBalance.findMany({
      where,
      include: {
        product: { include: { category: true, unit: true } },
        branch: true,
      },
      orderBy: { product: { name: 'asc' } },
    });
  }

  // ───── Inventory Transactions (audit log) ─────

  async getTransactions(orgId: string, branchId?: string) {
    const where: any = {};
    if (branchId) {
      where.branchId = branchId;
    } else {
      where.branch = { organizationId: orgId };
    }

    return this.prisma.inventoryTransaction.findMany({
      where,
      include: { product: true, branch: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  // ───── Stock Adjustment ─────

  async adjustStock(orgId: string, dto: AdjustStockDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.quantityChange < 0) {
        const current = await tx.stockBalance.findFirst({
          where: { branchId: dto.branchId, productId: dto.productId },
        });
        if (!current || current.quantity + dto.quantityChange < 0) {
          throw new BadRequestException(
            `Insufficient stock. Current: ${current?.quantity ?? 0}`,
          );
        }
      }

      await this.upsertStockBalance(
        tx,
        dto.branchId,
        dto.productId,
        dto.quantityChange,
      );

      return tx.inventoryTransaction.create({
        data: {
          productId: dto.productId,
          branchId: dto.branchId,
          type: dto.quantityChange > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(dto.quantityChange),
          reference: `Adjustment: ${dto.reason}`,
        },
      });
    });
  }

  // ───── Stock Transfer ─────

  async transferStock(orgId: string, dto: TransferStockDto) {
    if (dto.quantity <= 0) {
      throw new BadRequestException('Transfer quantity must be positive.');
    }

    return this.prisma.$transaction(async (tx) => {
      const sourceBalance = await tx.stockBalance.findFirst({
        where: { branchId: dto.fromBranchId, productId: dto.productId },
      });

      if (!sourceBalance || sourceBalance.quantity < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock at source branch. Available: ${sourceBalance?.quantity ?? 0}`,
        );
      }

      await tx.stockBalance.update({
        where: { id: sourceBalance.id },
        data: { quantity: { decrement: dto.quantity } },
      });

      await this.upsertStockBalance(
        tx,
        dto.toBranchId,
        dto.productId,
        dto.quantity,
      );

      await tx.inventoryTransaction.create({
        data: {
          productId: dto.productId,
          branchId: dto.fromBranchId,
          type: 'OUT',
          quantity: dto.quantity,
          reference: `Transfer to branch ${dto.toBranchId}`,
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId: dto.productId,
          branchId: dto.toBranchId,
          type: 'IN',
          quantity: dto.quantity,
          reference: `Transfer from branch ${dto.fromBranchId}`,
        },
      });

      return {
        message: 'Stock transferred successfully',
        quantity: dto.quantity,
      };
    });
  }

  // ───── Helper: Upsert Stock Balance ─────

  private async upsertStockBalance(
    tx: any,
    branchId: string,
    productId: string,
    quantityDelta: number,
  ) {
    const existing = await tx.stockBalance.findFirst({
      where: { branchId, productId },
    });

    if (existing) {
      return tx.stockBalance.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantityDelta } },
      });
    } else {
      return tx.stockBalance.create({
        data: { branchId, productId, quantity: quantityDelta },
      });
    }
  }
}
