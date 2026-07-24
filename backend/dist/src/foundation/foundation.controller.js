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
exports.FoundationController = void 0;
const common_1 = require("@nestjs/common");
const foundation_service_1 = require("./foundation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let FoundationController = class FoundationController {
    foundationService;
    constructor(foundationService) {
        this.foundationService = foundationService;
    }
    getCategories() { return this.foundationService.getCategories(); }
    createCategory(body) { return this.foundationService.createCategory(body); }
    deleteCategory(id) { return this.foundationService.deleteCategory(id); }
    getBrands() { return this.foundationService.getBrands(); }
    createBrand(body) { return this.foundationService.createBrand(body); }
    deleteBrand(id) { return this.foundationService.deleteBrand(id); }
    getUnits() { return this.foundationService.getUnits(); }
    createUnit(body) { return this.foundationService.createUnit(body); }
    deleteUnit(id) { return this.foundationService.deleteUnit(id); }
    getShops() { return this.foundationService.getShops(); }
    createShop(body) { return this.foundationService.createShop(body); }
    getBranches() { return this.foundationService.getBranches(); }
    createBranch(body) { return this.foundationService.createBranch(body); }
    getUsers() { return this.foundationService.getUsers(); }
    updateUserRole(id, body) {
        return this.foundationService.updateUserRole(id, body.role);
    }
};
exports.FoundationController = FoundationController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getBrands", null);
__decorate([
    (0, common_1.Post)('brands'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Get)('units'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Post)('units'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Delete)('units/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Get)('shops'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getShops", null);
__decorate([
    (0, common_1.Post)('shops'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createShop", null);
__decorate([
    (0, common_1.Get)('branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Post)('branches'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "updateUserRole", null);
exports.FoundationController = FoundationController = __decorate([
    (0, common_1.Controller)('foundation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [foundation_service_1.FoundationService])
], FoundationController);
//# sourceMappingURL=foundation.controller.js.map