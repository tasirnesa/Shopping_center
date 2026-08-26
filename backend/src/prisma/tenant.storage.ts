import { AsyncLocalStorage } from 'async_hooks';

// This acts as a microscopic "backpack" that holds the logged-in user's context across the entire request lifecycle.
export const tenantStorage = new AsyncLocalStorage<{ organizationId: string | null; role: string | null }>();
