import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
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
    summary(orgId: string): Promise<{
        total: number;
        thisMonth: number;
        count: number;
    }>;
    create(orgId: string, dto: CreateExpenseDto): Promise<{
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
}
