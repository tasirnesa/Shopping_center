import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
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
    summary(orgId: string): Promise<{
        total: number;
        thisMonth: number;
        count: number;
    }>;
    create(orgId: string, dto: CreateExpenseDto): Promise<{
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
}
