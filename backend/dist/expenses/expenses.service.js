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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, branchId) {
        return this.prisma.expense.findMany({
            where: {
                organizationId: orgId,
                ...(branchId ? { branchId } : {}),
            },
            include: { branch: true },
            orderBy: { date: 'desc' },
        });
    }
    async create(orgId, data) {
        return this.prisma.expense.create({
            data: {
                organizationId: orgId,
                branchId: data.branchId,
                description: data.description,
                amount: data.amount,
                date: data.date ? new Date(data.date) : new Date(),
            },
            include: { branch: true },
        });
    }
    async remove(orgId, id) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return this.prisma.expense.delete({ where: { id } });
    }
    async summary(orgId) {
        const expenses = await this.prisma.expense.findMany({
            where: { organizationId: orgId },
        });
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        const thisMonth = expenses
            .filter((e) => {
            const now = new Date();
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
            .reduce((sum, e) => sum + e.amount, 0);
        return { total, thisMonth, count: expenses.length };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map