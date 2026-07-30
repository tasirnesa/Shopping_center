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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, data) {
        return this.prisma.product.create({
            data: { ...data, organizationId: orgId },
            include: { category: true, brand: true, unit: true },
        });
    }
    async findAll(orgId) {
        return this.prisma.product.findMany({
            where: { organizationId: orgId },
            include: { category: true, brand: true, unit: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(orgId, id) {
        return this.prisma.product.findFirst({
            where: { id, organizationId: orgId },
            include: { category: true, brand: true, unit: true },
        });
    }
    async findByBarcode(orgId, barcode) {
        return this.prisma.product.findFirst({
            where: { barcode, organizationId: orgId },
            include: { category: true, brand: true, unit: true },
        });
    }
    async update(orgId, id, data) {
        const product = await this.prisma.product.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!product)
            return null;
        return this.prisma.product.update({
            where: { id },
            data,
            include: { category: true, brand: true, unit: true },
        });
    }
    async remove(orgId, id) {
        const product = await this.prisma.product.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!product)
            return null;
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map