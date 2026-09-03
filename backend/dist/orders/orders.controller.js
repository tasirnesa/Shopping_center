"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path = __importStar(require("path"));
const orders_service_1 = require("./orders.service");
const warehouse_service_1 = require("./warehouse.service");
const delivery_service_1 = require("./delivery.service");
const file_upload_service_1 = require("./file-upload.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const reject_order_dto_1 = require("./dto/reject-order.dto");
const cancel_order_dto_1 = require("./dto/cancel-order.dto");
const return_order_dto_1 = require("./dto/return-order.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const order_owner_decorator_1 = require("./order-owner.decorator");
const client_1 = require("@prisma/client");
let OrdersController = class OrdersController {
    ordersService;
    warehouseService;
    deliveryService;
    fileUploadService;
    constructor(ordersService, warehouseService, deliveryService, fileUploadService) {
        this.ordersService = ordersService;
        this.warehouseService = warehouseService;
        this.deliveryService = deliveryService;
        this.fileUploadService = fileUploadService;
    }
    create(req, createOrderDto) {
        return this.ordersService.create(req.user.id, req.user.organizationId, createOrderDto);
    }
    findAll(req) {
        return this.ordersService.findAll(req.user.id, req.user.role, req.user.organizationId);
    }
    findOne(req, id) {
        return this.ordersService.findOne(id, req.user.id, req.user.role, req.user.organizationId);
    }
    update(req, id, updateOrderDto) {
        return this.ordersService.update(id, req.user.id, updateOrderDto);
    }
    submit(req, id) {
        return this.ordersService.submit(id, req.user.id, req.user.organizationId);
    }
    approve(req, id) {
        return this.ordersService.approve(id, req.user.id, req.user.organizationId);
    }
    reject(req, id, rejectDto) {
        return this.ordersService.reject(id, req.user.id, req.user.organizationId, rejectDto.reason);
    }
    cancel(req, id, cancelDto) {
        return this.ordersService.cancel(id, req.user.id, req.user.organizationId, cancelDto.reason ?? '', req.user.role);
    }
    returnOrder(req, id, returnDto) {
        return this.ordersService.returnOrder(id, req.user.id, req.user.organizationId, returnDto.reason ?? '');
    }
    startPicking(req, id) {
        return this.warehouseService.startPicking(id, req.user.id, req.user.organizationId);
    }
    confirmPicking(req, id) {
        return this.warehouseService.confirmPickingForOrder(id, req.user.id, req.user.organizationId);
    }
    pickup(req, id) {
        return this.deliveryService.pickup(id, req.user.id, req.user.organizationId);
    }
    async confirmDelivery(req, id, file) {
        let confirmationPath;
        if (file) {
            this.fileUploadService.validateFile(file);
            const subPath = path.join(req.user.organizationId, id, 'delivery');
            confirmationPath = await this.fileUploadService.store(file, subPath);
        }
        return this.deliveryService.confirmDelivery(id, req.user.id, req.user.organizationId, confirmationPath);
    }
    uploadAttachment(req, id, type, file) {
        if (!file)
            throw new common_1.BadRequestException('File is required');
        if (!type)
            throw new common_1.BadRequestException('Attachment type is required');
        return this.ordersService.uploadAttachment(id, req.user.id, req.user.organizationId, type, file);
    }
    async downloadAttachment(req, id, attachmentId, res) {
        const attachment = await this.ordersService.getAttachment(id, attachmentId, req.user.organizationId);
        const absPath = path.resolve(attachment.filePath);
        res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(attachment.fileName)}"`);
        res.sendFile(absPath);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.INVOICE_MAKER, client_1.Role.STORE_MAN, client_1.Role.MANAGER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.INVOICE_MAKER, client_1.Role.STORE_MAN, client_1.Role.MANAGER, client_1.Role.OWNER, client_1.Role.DRIVER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.OWNER),
    (0, order_owner_decorator_1.OrderOwner)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.OWNER),
    (0, order_owner_decorator_1.OrderOwner)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.INVOICE_MAKER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.Role.INVOICE_MAKER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reject_order_dto_1.RejectOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.MANAGER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cancel_order_dto_1.CancelOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    (0, roles_decorator_1.Roles)(client_1.Role.MANAGER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, return_order_dto_1.ReturnOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "returnOrder", null);
__decorate([
    (0, common_1.Post)(':id/pick'),
    (0, roles_decorator_1.Roles)(client_1.Role.STORE_MAN, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "startPicking", null);
__decorate([
    (0, common_1.Post)(':id/pack'),
    (0, roles_decorator_1.Roles)(client_1.Role.STORE_MAN, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "confirmPicking", null);
__decorate([
    (0, common_1.Post)(':id/pickup'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "pickup", null);
__decorate([
    (0, common_1.Post)(':id/deliver'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirmDelivery", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.OWNER, client_1.Role.MANAGER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "uploadAttachment", null);
__decorate([
    (0, common_1.Get)(':id/attachments/:attachmentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.SALES_REP, client_1.Role.INVOICE_MAKER, client_1.Role.STORE_MAN, client_1.Role.MANAGER, client_1.Role.DRIVER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "downloadAttachment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        warehouse_service_1.WarehouseService,
        delivery_service_1.DeliveryService,
        file_upload_service_1.FileUploadService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map