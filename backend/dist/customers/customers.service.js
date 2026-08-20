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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return this.prisma.customer.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(orgId, id) {
        return this.prisma.customer.findFirst({
            where: { id, organizationId: orgId },
        });
    }
    async create(orgId, data) {
        if (data.tin) {
            const existing = await this.prisma.customer.findFirst({
                where: { organizationId: orgId, tin: data.tin.trim() },
            });
            if (existing) {
                throw new common_1.ConflictException(`A customer with TIN "${data.tin}" already exists in your organization`);
            }
        }
        return this.prisma.customer.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async update(orgId, id, data) {
        const customer = await this.prisma.customer.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!customer)
            return null;
        if (data.tin && data.tin.trim() !== customer.tin) {
            const existing = await this.prisma.customer.findFirst({
                where: { organizationId: orgId, tin: data.tin.trim(), NOT: { id } },
            });
            if (existing) {
                throw new common_1.ConflictException(`A customer with TIN "${data.tin}" already exists in your organization`);
            }
        }
        return this.prisma.customer.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const customer = await this.prisma.customer.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!customer)
            return null;
        return this.prisma.customer.delete({ where: { id } });
    }
    async saveEfdaLicense(orgId, id, filePath, fileName) {
        const customer = await this.prisma.customer.findFirst({ where: { id, organizationId: orgId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customer.update({
            where: { id },
            data: { efdaLicensePath: filePath, efdaLicenseFileName: fileName },
        });
    }
    async getCredit(orgId, id) {
        const customer = await this.prisma.customer.findFirst({
            where: { id, organizationId: orgId },
            select: { id: true, name: true, creditLimit: true, creditBalance: true },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async addCredit(orgId, customerId, amount) {
        const customer = await this.prisma.customer.findFirst({ where: { id: customerId, organizationId: orgId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customer.update({
            where: { id: customerId },
            data: { creditBalance: { increment: amount } },
        });
    }
    async settleCredit(orgId, customerId, amount) {
        const customer = await this.prisma.customer.findFirst({ where: { id: customerId, organizationId: orgId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customer.update({
            where: { id: customerId },
            data: { creditBalance: { decrement: amount } },
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map