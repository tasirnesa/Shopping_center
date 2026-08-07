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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const org_decorator_1 = require("../auth/org.decorator");
let SalesController = class SalesController {
    salesService;
    constructor(salesService) {
        this.salesService = salesService;
    }
    create(orgId, userBranchId, dto) {
        const branchId = dto.branchId || userBranchId;
        if (!branchId) {
            throw new common_1.BadRequestException('branchId is required');
        }
        return this.salesService.create(orgId, { ...dto, branchId });
    }
    findAll(orgId) {
        return this.salesService.findAll(orgId);
    }
    findOne(orgId, id) {
        return this.salesService.findOne(orgId, id);
    }
    processReturn(orgId, userBranchId, dto) {
        const branchId = dto.branchId || userBranchId;
        if (!dto.saleId || !branchId) {
            throw new common_1.BadRequestException('saleId and branchId are required');
        }
        return this.salesService.processReturn(orgId, { ...dto, branchId });
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER', 'CASHIER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, org_decorator_1.CurrentBranch)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER', 'CASHIER', 'SALES_REP', 'INVOICE_MAKER', 'STORE_MAN'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER', 'CASHIER', 'SALES_REP', 'INVOICE_MAKER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('returns'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER', 'CASHIER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, org_decorator_1.CurrentBranch)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "processReturn", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map