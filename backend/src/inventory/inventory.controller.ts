import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentOrg } from '../auth/org.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ───── Suppliers ─────

  @Get('suppliers')
  getSuppliers(@CurrentOrg() orgId: string) {
    return this.inventoryService.getSuppliers(orgId);
  }

  @Post('suppliers')
  createSupplier(@CurrentOrg() orgId: string, @Body() dto: CreateSupplierDto) {
    return this.inventoryService.createSupplier(orgId, dto);
  }

  // ───── Purchases / Goods Receipt ─────

  @Get('inventory/purchases')
  getPurchases(@CurrentOrg() orgId: string) {
    return this.inventoryService.getPurchases(orgId);
  }

  @Post('inventory/purchases')
  createPurchase(@CurrentOrg() orgId: string, @Body() dto: CreatePurchaseDto) {
    return this.inventoryService.createPurchase(orgId, dto);
  }

  // ───── Stock Balance ─────

  @Get('inventory/stock-balance')
  getStockBalance(
    @CurrentOrg() orgId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.inventoryService.getStockBalance(orgId, branchId);
  }

  // ───── Inventory Transactions (audit log) ─────

  @Get('inventory/transactions')
  getTransactions(
    @CurrentOrg() orgId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.inventoryService.getTransactions(orgId, branchId);
  }

  // ───── Stock Adjustment ─────

  @Post('inventory/adjustments')
  adjustStock(@CurrentOrg() orgId: string, @Body() dto: AdjustStockDto) {
    return this.inventoryService.adjustStock(orgId, dto);
  }

  // ───── Stock Transfer ─────

  @Post('inventory/transfers')
  transferStock(@CurrentOrg() orgId: string, @Body() dto: TransferStockDto) {
    return this.inventoryService.transferStock(orgId, dto);
  }
}
