import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    } | null>;
    create(orgId: string, data: {
        name: string;
        phone?: string;
        email?: string;
    }): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }>;
    update(orgId: string, id: string, data: {
        name?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    } | null>;
    remove(orgId: string, id: string): Promise<{
        email: string | null;
        name: string;
        organizationId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    } | null>;
}
