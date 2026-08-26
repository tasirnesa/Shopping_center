import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, branchId?: string): Promise<({
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        organizationId: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            name: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        branchId: string;
        id: string;
        createdAt: Date;
        organizationId: string;
        description: string;
        amount: number;
        date: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        branchId: string;
        id: string;
        createdAt: Date;
        organizationId: string;
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
