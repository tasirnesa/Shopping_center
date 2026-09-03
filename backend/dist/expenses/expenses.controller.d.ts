import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
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
    summary(orgId: string): Promise<{
        total: number;
        thisMonth: number;
        count: number;
    }>;
    create(orgId: string, dto: CreateExpenseDto): Promise<{
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
}
