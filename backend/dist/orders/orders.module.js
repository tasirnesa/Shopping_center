"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const orders_controller_1 = require("./orders.controller");
const invoices_controller_1 = require("./invoices.controller");
const deliveries_controller_1 = require("./deliveries.controller");
const orders_service_1 = require("./orders.service");
const state_machine_service_1 = require("./state-machine.service");
const audit_service_1 = require("./audit.service");
const file_upload_service_1 = require("./file-upload.service");
const invoice_service_1 = require("./invoice.service");
const warehouse_service_1 = require("./warehouse.service");
const delivery_service_1 = require("./delivery.service");
const order_owner_guard_1 = require("./order-owner.guard");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            platform_express_1.MulterModule.register({ storage: (0, multer_1.memoryStorage)() }),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [orders_controller_1.OrdersController, invoices_controller_1.InvoicesController, deliveries_controller_1.DeliveriesController],
        providers: [
            orders_service_1.OrdersService,
            state_machine_service_1.StateMachineService,
            audit_service_1.AuditService,
            file_upload_service_1.FileUploadService,
            invoice_service_1.InvoiceService,
            warehouse_service_1.WarehouseService,
            delivery_service_1.DeliveryService,
            order_owner_guard_1.OrderOwnerGuard,
        ],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map