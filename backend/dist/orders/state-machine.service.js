"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachineService = exports.TRANSITIONS = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
exports.TRANSITIONS = {
    DRAFT: {
        submit: { allowedRoles: [client_1.Role.SALES_REP, client_1.Role.OWNER], to: client_1.OrderStatus.SUBMITTED },
        cancel: { allowedRoles: [client_1.Role.SALES_REP, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    SUBMITTED: {
        approve: {
            allowedRoles: [client_1.Role.INVOICE_MAKER, client_1.Role.OWNER],
            intermediates: [client_1.OrderStatus.WAITING_FOR_INVOICE, client_1.OrderStatus.INVOICE_APPROVED],
            to: client_1.OrderStatus.WAITING_FOR_WAREHOUSE,
        },
        reject: { allowedRoles: [client_1.Role.INVOICE_MAKER, client_1.Role.OWNER], to: client_1.OrderStatus.REJECTED },
        cancel: { allowedRoles: [client_1.Role.SALES_REP, client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    WAITING_FOR_INVOICE: {},
    INVOICE_APPROVED: {},
    WAITING_FOR_WAREHOUSE: {
        'start-picking': { allowedRoles: [client_1.Role.STORE_MAN, client_1.Role.OWNER], to: client_1.OrderStatus.PICKING },
        cancel: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    PICKING: {
        'confirm-picking': {
            allowedRoles: [client_1.Role.STORE_MAN, client_1.Role.OWNER],
            intermediates: [client_1.OrderStatus.PACKED],
            to: client_1.OrderStatus.READY_FOR_DELIVERY,
        },
        cancel: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    PACKED: {
        cancel: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    READY_FOR_DELIVERY: {
        pickup: { allowedRoles: [client_1.Role.DRIVER, client_1.Role.OWNER, client_1.Role.MANAGER], to: client_1.OrderStatus.OUT_FOR_DELIVERY },
        cancel: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.CANCELLED },
    },
    OUT_FOR_DELIVERY: {
        'confirm-delivery': {
            allowedRoles: [client_1.Role.DRIVER, client_1.Role.OWNER, client_1.Role.MANAGER],
            intermediates: [client_1.OrderStatus.DELIVERED],
            to: client_1.OrderStatus.COMPLETED,
        },
    },
    DELIVERED: {
        return: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.RETURNED },
    },
    COMPLETED: {
        return: { allowedRoles: [client_1.Role.MANAGER, client_1.Role.OWNER], to: client_1.OrderStatus.RETURNED },
    },
    REJECTED: {},
    CANCELLED: {},
    RETURNED: {},
};
let StateMachineService = class StateMachineService {
    transition(currentStatus, event, role) {
        const allowed = exports.TRANSITIONS[currentStatus]?.[event];
        if (!allowed) {
            throw new common_1.BadRequestException(`Event '${event}' not valid from status '${currentStatus}'`);
        }
        if (!allowed.allowedRoles.includes(role)) {
            throw new common_1.ForbiddenException(`Role '${role}' cannot perform '${event}'`);
        }
        return allowed.to;
    }
    getIntermediates(currentStatus, event) {
        const allowed = exports.TRANSITIONS[currentStatus]?.[event];
        return allowed?.intermediates || [];
    }
};
exports.StateMachineService = StateMachineService;
exports.StateMachineService = StateMachineService = __decorate([
    (0, common_1.Injectable)()
], StateMachineService);
//# sourceMappingURL=state-machine.service.js.map