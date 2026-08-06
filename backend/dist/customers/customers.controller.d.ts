import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
    create(orgId: string, dto: {
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
    update(orgId: string, id: string, dto: {
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
