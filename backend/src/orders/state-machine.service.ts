import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';

export type Transition = {
    allowedRoles: Role[];
    intermediates?: OrderStatus[];
    to: OrderStatus;
};

export const TRANSITIONS: Record<OrderStatus, Record<string, Transition>> = {
    DRAFT: {
        submit: { allowedRoles: [Role.SALES_REP, Role.OWNER], to: OrderStatus.SUBMITTED },
        cancel: { allowedRoles: [Role.SALES_REP, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    SUBMITTED: {
        approve: {
            allowedRoles: [Role.INVOICE_MAKER, Role.OWNER],
            intermediates: [OrderStatus.WAITING_FOR_INVOICE, OrderStatus.INVOICE_APPROVED],
            to: OrderStatus.WAITING_FOR_WAREHOUSE,
        },
        reject: { allowedRoles: [Role.INVOICE_MAKER, Role.OWNER], to: OrderStatus.REJECTED },
        cancel: { allowedRoles: [Role.SALES_REP, Role.MANAGER, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    WAITING_FOR_INVOICE: {},
    INVOICE_APPROVED: {},
    WAITING_FOR_WAREHOUSE: {
        'start-picking': { allowedRoles: [Role.STORE_MAN, Role.OWNER], to: OrderStatus.PICKING },
        cancel: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    PICKING: {
        'confirm-picking': {
            allowedRoles: [Role.STORE_MAN, Role.OWNER],
            intermediates: [OrderStatus.PACKED],
            to: OrderStatus.READY_FOR_DELIVERY,
        },
        cancel: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    PACKED: {
        cancel: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    READY_FOR_DELIVERY: {
        pickup: { allowedRoles: [Role.DRIVER, Role.OWNER, Role.MANAGER], to: OrderStatus.OUT_FOR_DELIVERY },
        cancel: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.CANCELLED },
    },
    OUT_FOR_DELIVERY: {
        'confirm-delivery': {
            allowedRoles: [Role.DRIVER, Role.OWNER, Role.MANAGER],
            intermediates: [OrderStatus.DELIVERED],
            to: OrderStatus.COMPLETED,
        },
    },
    DELIVERED: {
        return: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.RETURNED },
    },
    COMPLETED: {
        return: { allowedRoles: [Role.MANAGER, Role.OWNER], to: OrderStatus.RETURNED },
    },
    REJECTED: {},
    CANCELLED: {},
    RETURNED: {},
};

@Injectable()
export class StateMachineService {
    transition(currentStatus: OrderStatus, event: string, role: Role): OrderStatus {
        const allowed = TRANSITIONS[currentStatus]?.[event];
        if (!allowed) {
            throw new BadRequestException(`Event '${event}' not valid from status '${currentStatus}'`);
        }
        if (!allowed.allowedRoles.includes(role)) {
            throw new ForbiddenException(`Role '${role}' cannot perform '${event}'`);
        }
        return allowed.to;
    }

    getIntermediates(currentStatus: OrderStatus, event: string): OrderStatus[] {
        const allowed = TRANSITIONS[currentStatus]?.[event];
        return allowed?.intermediates || [];
    }
}
