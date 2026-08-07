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
    async getCategories(orgId) {
        return this.prisma.category.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(orgId, data) {
        return this.prisma.category.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async deleteCategory(orgId, id) {
        return this.prisma.category.deleteMany({
            where: { id, organizationId: orgId },
        });
    }
    async getBrands(orgId) {
        return this.prisma.brand.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async createBrand(orgId, data) {
        return this.prisma.brand.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async deleteBrand(orgId, id) {
        return this.prisma.brand.deleteMany({
            where: { id, organizationId: orgId },
        });
    }
    async getUnits(orgId) {
        return this.prisma.unit.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async createUnit(orgId, data) {
        return this.prisma.unit.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async deleteUnit(orgId, id) {
        return this.prisma.unit.deleteMany({
            where: { id, organizationId: orgId },
        });
    }
    async getBranches(orgId) {
        return this.prisma.branch.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async createBranch(orgId, data) {
        return this.prisma.branch.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async updateBranch(orgId, id, data) {
        const branch = await this.prisma.branch.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return this.prisma.branch.update({ where: { id }, data });
    }
    async deleteBranch(orgId, id) {
        const branch = await this.prisma.branch.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return this.prisma.branch.delete({ where: { id } });
    }
    async createUser(data) {
        const bcrypt = await import('bcrypt');
        const hashed = await bcrypt.hash(data.password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashed,
                    name: data.name,
                    role: data.role,
                    organizationId: data.organizationId,
                    branchId: data.branchId ?? null,
                },
            });
            const { password, ...result } = user;
            return result;
        }
        catch (e) {
            if (e.code === 'P2002')
                throw new common_1.BadRequestException('Email already registered');
            throw e;
        }
    }
    async getUsers(orgId) {
        return this.prisma.user.findMany({
            where: orgId ? { organizationId: orgId } : undefined,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                branchId: true,
                branch: { select: { id: true, name: true } },
                organization: { select: { id: true, name: true } },
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserRole(orgId, id, role) {
        return this.prisma.user.updateMany({
            where: { id, organizationId: orgId },
            data: { role },
        });
    }
    async updateUserStatus(orgId, id, status) {
        return this.prisma.user.updateMany({
            where: { id, organizationId: orgId },
            data: { status },
        });
    }
};
exports.FoundationService = FoundationService;
exports.FoundationService = FoundationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoundationService);
//# sourceMappingURL=foundation.service.js.map