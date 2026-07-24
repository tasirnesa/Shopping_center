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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoundationService = class FoundationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }
    async createCategory(data) { return this.prisma.category.create({ data }); }
    async deleteCategory(id) { return this.prisma.category.delete({ where: { id } }); }
    async getBrands() { return this.prisma.brand.findMany({ orderBy: { name: 'asc' } }); }
    async createBrand(data) { return this.prisma.brand.create({ data }); }
    async deleteBrand(id) { return this.prisma.brand.delete({ where: { id } }); }
    async getUnits() { return this.prisma.unit.findMany({ orderBy: { name: 'asc' } }); }
    async createUnit(data) { return this.prisma.unit.create({ data }); }
    async deleteUnit(id) { return this.prisma.unit.delete({ where: { id } }); }
    async getShops() { return this.prisma.shop.findMany({ orderBy: { name: 'asc' }, include: { branches: true } }); }
    async createShop(data) { return this.prisma.shop.create({ data }); }
    async getBranches() { return this.prisma.branch.findMany({ orderBy: { name: 'asc' }, include: { shop: true } }); }
    async createBranch(data) { return this.prisma.branch.create({ data }); }
    async getUsers() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, role: true, branchId: true, branch: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateUserRole(id, role) {
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true }
        });
    }
};
exports.FoundationService = FoundationService;
exports.FoundationService = FoundationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoundationService);
//# sourceMappingURL=foundation.service.js.map