import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
    create(orgId: string, dto: {
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
    update(orgId: string, id: string, dto: {
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
