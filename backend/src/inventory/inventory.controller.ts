import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    // ───── Suppliers ─────

    @Get('suppliers')
    getSuppliers() {
        return this.inventoryService.getSuppliers();
    }

    @Post('suppliers')
    createSupplier(@Body() dto: CreateSupplierDto) {
        return this.inventoryService.createSupplier(dto);
    }

    // ───── Purchases / Goods Receipt ─────

    @Get('inventory/purchases')
    getPurchases() {
        return this.inventoryService.getPurchases();
    }

    @Post('inventory/purchases')
    createPurchase(@Body() dto: CreatePurchaseDto) {
        return this.inventoryService.createPurchase(dto);
    }

    // ───── Stock Balance ─────

    @Get('inventory/stock-balance')
    getStockBalance(@Query('branchId') branchId?: string) {
        return this.inventoryService.getStockBalance(branchId);
    }

    // ───── Inventory Transactions (audit log) ─────

    @Get('inventory/transactions')
    getTransactions(@Query('branchId') branchId?: string) {
        return this.inventoryService.getTransactions(branchId);
    }

    // ───── Stock Adjustment ─────

    @Post('inventory/adjustments')
    adjustStock(@Body() dto: AdjustStockDto) {
        return this.inventoryService.adjustStock(dto);
    }

    // ───── Stock Transfer ─────

    @Post('inventory/transfers')
    transferStock(@Body() dto: TransferStockDto) {
        return this.inventoryService.transferStock(dto);
    }
}
