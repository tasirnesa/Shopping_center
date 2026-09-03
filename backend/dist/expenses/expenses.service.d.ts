import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, branchId?: string): Promise<({
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        createdAt: Date;
        amount: number;
        description: string;
        date: Date;
    })[]>;
    create(orgId: string, data: {
        branchId: string;
        description: string;
        amount: number;
        date?: string;
    }): Promise<{
        branch: {
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            phone: string | null;
            address: string | null;
        };
    } & {
        organizationId: string;
        id: string;
        branchId: string;
        createdAt: Date;
        amount: number;
        description: string;
        date: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        organizationId: string;
        id: string;
        branchId: string;
        createdAt: Date;
        amount: number;
        description: string;
        date: Date;
    }>;
    summary(orgId: string): Promise<{
        total: number;
        thisMonth: number;
        count: number;
    }>;
}
