import { OrderStatus, Role } from '@prisma/client';
export type Transition = {
    allowedRoles: Role[];
    intermediates?: OrderStatus[];
    to: OrderStatus;
};
export declare const TRANSITIONS: Record<OrderStatus, Record<string, Transition>>;
export declare class StateMachineService {
    transition(currentStatus: OrderStatus, event: string, role: Role): OrderStatus;
    getIntermediates(currentStatus: OrderStatus, event: string): OrderStatus[];
}
