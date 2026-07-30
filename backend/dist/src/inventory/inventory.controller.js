"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
const create_purchase_dto_1 = require("./dto/create-purchase.dto");
const adjust_stock_dto_1 = require("./dto/adjust-stock.dto");
const transfer_stock_dto_1 = require("./dto/transfer-stock.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const org_decorator_1 = require("../auth/org.decorator");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getSuppliers(orgId) {
        return this.inventoryService.getSuppliers(orgId);
    }
    createSupplier(orgId, dto) {
        return this.inventoryService.createSupplier(orgId, dto);
    }
    getPurchases(orgId) {
        return this.inventoryService.getPurchases(orgId);
    }
    createPurchase(orgId, dto) {
        return this.inventoryService.createPurchase(orgId, dto);
    }
    getStockBalance(orgId, branchId) {
        return this.inventoryService.getStockBalance(orgId, branchId);
    }
    getTransactions(orgId, branchId) {
        return this.inventoryService.getTransactions(orgId, branchId);
    }
    adjustStock(orgId, dto) {
        return this.inventoryService.adjustStock(orgId, dto);
    }
    transferStock(orgId, dto) {
        return this.inventoryService.transferStock(orgId, dto);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('suppliers'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getSuppliers", null);
__decorate([
    (0, common_1.Post)('suppliers'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplier_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Get)('inventory/purchases'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getPurchases", null);
__decorate([
    (0, common_1.Post)('inventory/purchases'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_purchase_dto_1.CreatePurchaseDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createPurchase", null);
__decorate([
    (0, common_1.Get)('inventory/stock-balance'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockBalance", null);
__decorate([
    (0, common_1.Get)('inventory/transactions'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Post)('inventory/adjustments'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, adjust_stock_dto_1.AdjustStockDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('inventory/transfers'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_stock_dto_1.TransferStockDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map