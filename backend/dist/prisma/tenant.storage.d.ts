import { AsyncLocalStorage } from 'async_hooks';
export declare const tenantStorage: AsyncLocalStorage<{
    organizationId: string | null;
    role: string | null;
}>;
