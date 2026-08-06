import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, branchId?: string): Promise<({
        branch: {
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        description: string;
        amount: number;
        date: Date;
    })[]>;
    create(orgId: string, data: {
        branchId: string;
        description: string;
        amount: number;
        date?: string;
    }): Promise<{
        branch: {
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        description: string;
        amount: number;
        date: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        organizationId: string;
        branchId: string;
        id: string;
        createdAt: Date;
        description: string;
        amount: number;
        date: Date;
    }>;
    summary(orgId: string): Promise<{
        total: number;
        thisMonth: number;
        count: number;
    }>;
}
