import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class FoundationService {
    constructor(private prisma: PrismaService) { }

    // ───── Categories ─────
    async getCategories() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }
    async createCategory(data: { name: string; description?: string }) { return this.prisma.category.create({ data }); }
    async deleteCategory(id: string) { return this.prisma.category.delete({ where: { id } }); }

    // ───── Brands ─────
    async getBrands() { return this.prisma.brand.findMany({ orderBy: { name: 'asc' } }); }
    async createBrand(data: { name: string }) { return this.prisma.brand.create({ data }); }
    async deleteBrand(id: string) { return this.prisma.brand.delete({ where: { id } }); }

    // ───── Units ─────
    async getUnits() { return this.prisma.unit.findMany({ orderBy: { name: 'asc' } }); }
    async createUnit(data: { name: string }) { return this.prisma.unit.create({ data }); }
    async deleteUnit(id: string) { return this.prisma.unit.delete({ where: { id } }); }

    // ───── Shops ─────
    async getShops() { return this.prisma.shop.findMany({ orderBy: { name: 'asc' }, include: { branches: true } }); }
    async createShop(data: { name: string; ownerId: string }) { return this.prisma.shop.create({ data }); }

    // ───── Branches ─────
    async getBranches() { return this.prisma.branch.findMany({ orderBy: { name: 'asc' }, include: { shop: true } }); }
    async createBranch(data: { name: string; shopId: string }) { return this.prisma.branch.create({ data }); }

    // ───── Users (Admin Only) ─────
    async getUsers() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, role: true, branchId: true, branch: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateUserRole(id: string, role: Role) {
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true }
        });
    }
}
