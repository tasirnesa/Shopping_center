import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        phone: string | null;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        phone: string | null;
    } | null>;
    create(orgId: string, data: {
        name: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        phone: string | null;
    }>;
    update(orgId: string, id: string, data: {
        name?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        phone: string | null;
    } | null>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        phone: string | null;
    } | null>;
}
