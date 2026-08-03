import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(orgId: string, branchId?: string): Promise<({
        branch: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        organizationId: string;
        branchId: string;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            phone: string | null;
            address: string | null;
            code: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        organizationId: string;
        branchId: string;
        description: string;
        amount: number;
        date: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        branchId: string;
        description: string;
        amount: number;
        date: Date;
    }>;
}
