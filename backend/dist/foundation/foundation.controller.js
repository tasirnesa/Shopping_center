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
const org_decorator_1 = require("../auth/org.decorator");
const client_1 = require("@prisma/client");
let FoundationController = class FoundationController {
    foundationService;
    constructor(foundationService) {
        this.foundationService = foundationService;
    }
    getCategories(orgId) {
        return this.foundationService.getCategories(orgId);
    }
    createCategory(orgId, body) {
        return this.foundationService.createCategory(orgId, body);
    }
    deleteCategory(orgId, id) {
        return this.foundationService.deleteCategory(orgId, id);
    }
    getBrands(orgId) {
        return this.foundationService.getBrands(orgId);
    }
    createBrand(orgId, body) {
        return this.foundationService.createBrand(orgId, body);
    }
    deleteBrand(orgId, id) {
        return this.foundationService.deleteBrand(orgId, id);
    }
    getUnits(orgId) {
        return this.foundationService.getUnits(orgId);
    }
    createUnit(orgId, body) {
        return this.foundationService.createUnit(orgId, body);
    }
    deleteUnit(orgId, id) {
        return this.foundationService.deleteUnit(orgId, id);
    }
    getBranches(orgId) {
        return this.foundationService.getBranches(orgId);
    }
    createBranch(orgId, body) {
        return this.foundationService.createBranch(orgId, body);
    }
    updateBranch(orgId, id, body) {
        return this.foundationService.updateBranch(orgId, id, body);
    }
    deleteBranch(orgId, id) {
        return this.foundationService.deleteBranch(orgId, id);
    }
    getUsers(orgId, req) {
        const effectiveOrgId = req.user.role === client_1.Role.SYSTEM_ADMIN ? undefined : orgId;
        return this.foundationService.getUsers(effectiveOrgId);
    }
    updateUserRole(orgId, id, body) {
        return this.foundationService.updateUserRole(orgId, id, body.role);
    }
    updateUserStatus(orgId, id, body) {
        return this.foundationService.updateUserStatus(orgId, id, body.status);
    }
};
exports.FoundationController = FoundationController;
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('brands'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getBrands", null);
__decorate([
    (0, common_1.Post)('brands'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Get)('units'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Post)('units'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Delete)('units/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'MANAGER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Get)('branches'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Post)('branches'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Patch)('branches/:id'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Delete)('branches/:id'),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "deleteBranch", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, roles_decorator_1.Roles)(client_1.Role.OWNER, client_1.Role.MANAGER, client_1.Role.SYSTEM_ADMIN),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, roles_decorator_1.Roles)(client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.OWNER, client_1.Role.SYSTEM_ADMIN),
    __param(0, (0, org_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FoundationController.prototype, "updateUserStatus", null);
exports.FoundationController = FoundationController = __decorate([
    (0, common_1.Controller)('foundation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [foundation_service_1.FoundationService])
], FoundationController);
//# sourceMappingURL=foundation.controller.js.map