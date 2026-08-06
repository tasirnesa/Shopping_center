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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const state_machine_service_1 = require("./state-machine.service");
const audit_service_1 = require("./audit.service");
const warehouse_service_1 = require("./warehouse.service");
const client_1 = require("@prisma/client");
const file_upload_service_1 = require("./file-upload.service");
const invoice_service_1 = require("./invoice.service");
const notifications_service_1 = require("../notifications/notifications.service");
const path = __importStar(require("path"));
let OrdersService = class OrdersService {
    prisma;
    stateMachine;
    audit;
    fileUpload;
    invoiceService;
    warehouseService;
    notifications;
    constructor(prisma, stateMachine, audit, fileUpload, invoiceService, warehouseService, notifications) {
        this.prisma = prisma;
        this.stateMachine = stateMachine;
        this.audit = audit;
        this.fileUpload = fileUpload;
        this.invoiceService = invoiceService;
        this.warehouseService = warehouseService;
        this.notifications = notifications;
    }
    computeLineTotal(unitPrice, quantity, discount = 0) {
        return (unitPrice * quantity) - discount;
    }
    async create(userId, orgId, dto) {
        let subtotal = 0;
        const mappedLines = dto.lines.map((line) => {
            const discount = line.discount || 0;
            const total = this.computeLineTotal(line.unitPrice, line.quantity, discount);
            subtotal += total;
            return {
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount,
                total,
            };
        });
        const taxRate = 15;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.create({
                data: {
                    organizationId: orgId,
                    branchId: dto.branchId,
                    salesRepId: userId,
                    customerName: dto.customerName,
                    tin: dto.tin,
                    deliveryAddress: dto.deliveryAddress,
                    customerPhone: dto.customerPhone,
                    status: client_1.OrderStatus.DRAFT,
                    subtotal,
                    taxRate,
                    taxAmount,
                    grandTotal,
                    lines: {
                        create: mappedLines,
                    },
                },
            });
            await this.audit.recordTransition(tx, order.id, null, client_1.OrderStatus.DRAFT, userId, 'Order created');
            return order;
        });
    }
    async findAll(userId, role, orgId) {
        if (role === client_1.Role.SALES_REP) {
            return this.prisma.salesOrder.findMany({
                where: { salesRepId: userId },
                include: { lines: { include: { product: true } }, attachments: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === client_1.Role.INVOICE_MAKER) {
            return this.prisma.salesOrder.findMany({
                where: { organizationId: orgId, status: client_1.OrderStatus.SUBMITTED },
                include: { lines: { include: { product: true } }, attachments: true },
                orderBy: { createdAt: 'asc' },
            });
        }
        return this.prisma.salesOrder.findMany({
            where: { organizationId: orgId },
            include: { lines: { include: { product: true } }, attachments: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role, orgId) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: {
                lines: { include: { product: true } },
                attachments: true,
                statusEvents: { orderBy: { createdAt: 'asc' }, include: { actor: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        if (order.organizationId !== orgId) {
            throw new common_1.ForbiddenException();
        }
        if (role === client_1.Role.SALES_REP && order.salesRepId !== userId) {
            throw new common_1.ForbiddenException(`Orders can only be accessed by their owner`);
        }
        return order;
    }
    async update(id, userId, dto) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException();
        if (order.status !== client_1.OrderStatus.DRAFT)
            throw new common_1.BadRequestException(`Cannot update non-draft order`);
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === client_1.Role.SALES_REP && order.salesRepId !== userId) {
            throw new common_1.ForbiddenException();
        }
        const updateData = {};
        if (dto.customerName !== undefined)
            updateData.customerName = dto.customerName;
        if (dto.tin !== undefined)
            updateData.tin = dto.tin;
        if (dto.deliveryAddress !== undefined)
            updateData.deliveryAddress = dto.deliveryAddress;
        if (dto.customerPhone !== undefined)
            updateData.customerPhone = dto.customerPhone;
        if (dto.branchId !== undefined)
            updateData.branchId = dto.branchId;
        if (dto.lines && dto.lines.length > 0) {
            let subtotal = 0;
            const mappedLines = dto.lines.map((line) => {
                const discount = line.discount || 0;
                const total = this.computeLineTotal(line.unitPrice, line.quantity, discount);
                subtotal += total;
                return { productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice, discount, total };
            });
            const taxRate = order.taxRate;
            const taxAmount = subtotal * (taxRate / 100);
            const grandTotal = subtotal + taxAmount;
            return this.prisma.$transaction(async (tx) => {
                await tx.salesOrderLine.deleteMany({ where: { salesOrderId: id } });
                return tx.salesOrder.update({
                    where: { id },
                    data: {
                        ...updateData,
                        subtotal,
                        taxAmount,
                        grandTotal,
                        lines: { create: mappedLines },
                    },
                });
            });
        }
        return this.prisma.salesOrder.update({
            where: { id },
            data: updateData,
        });
    }
    async submit(id, userId, orgId) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { attachments: true, lines: true },
        });
        if (!order)
            throw new common_1.NotFoundException();
        if (order.organizationId !== orgId)
            throw new common_1.ForbiddenException();
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === client_1.Role.SALES_REP && order.salesRepId !== userId) {
            throw new common_1.ForbiddenException();
        }
        if (!order.customerName || !order.tin || !order.deliveryAddress || order.lines.length === 0) {
            throw new common_1.BadRequestException('Order is missing mandatory fields');
        }
        const hasTradeLicense = order.attachments.some(a => a.type === 'TRADE_LICENSE');
        const hasPaymentReceipt = order.attachments.some(a => a.type === 'PAYMENT_RECEIPT');
        if (!hasTradeLicense || !hasPaymentReceipt) {
            throw new common_1.BadRequestException('Order must have Trade License and Payment Receipt attachments before submitting');
        }
        const nextStatus = this.stateMachine.transition(order.status, 'submit', client_1.Role.SALES_REP);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, 'Order submitted');
            await this.notifications.create(order.organizationId, client_1.Role.INVOICE_MAKER, 'order.submitted', { orderId: id, customerName: order.customerName });
            return updated;
        });
    }
    async uploadAttachment(id, userId, orgId, type, file) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException();
        if (order.organizationId !== orgId)
            throw new common_1.ForbiddenException();
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === client_1.Role.SALES_REP && order.salesRepId !== userId) {
            throw new common_1.ForbiddenException('Only the order owner can upload attachments');
        }
        if (order.status !== client_1.OrderStatus.DRAFT && order.status !== client_1.OrderStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Cannot upload attachments after order processing has started');
        }
        this.fileUpload.validateFile(file);
        const subPath = path.join(orgId, id);
        const storedPath = await this.fileUpload.store(file, subPath, type);
        return this.prisma.attachment.create({
            data: {
                salesOrderId: id,
                type,
                fileName: file.originalname,
                filePath: storedPath,
                mimeType: file.mimetype,
                fileSize: file.size,
                uploadedById: userId,
            }
        });
    }
    async getAttachment(orderId, attachmentId, orgId) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: { salesOrder: true },
        });
        if (!attachment || attachment.salesOrderId !== orderId) {
            throw new common_1.NotFoundException('Attachment not found');
        }
        if (attachment.salesOrder.organizationId !== orgId) {
            throw new common_1.ForbiddenException();
        }
        return attachment;
    }
    async approve(id, userId, orgId) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { attachments: true, lines: true },
        });
        if (!order)
            throw new common_1.NotFoundException();
        if (order.organizationId !== orgId)
            throw new common_1.ForbiddenException();
        this.stateMachine.transition(order.status, 'approve', client_1.Role.INVOICE_MAKER);
        return this.prisma.$transaction(async (tx) => {
            await this.audit.recordTransition(tx, id, order.status, client_1.OrderStatus.WAITING_FOR_INVOICE, userId, 'Approval step 1');
            await this.audit.recordTransition(tx, id, client_1.OrderStatus.WAITING_FOR_INVOICE, client_1.OrderStatus.INVOICE_APPROVED, userId, 'Approval step 2');
            const nextStatus = client_1.OrderStatus.WAITING_FOR_WAREHOUSE;
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, id, client_1.OrderStatus.INVOICE_APPROVED, nextStatus, userId, 'Sent to warehouse');
            await this.invoiceService.generateInvoice(tx, order, userId, orgId);
            await this.notifications.create(orgId, client_1.Role.STORE_MAN, 'order.invoice_approved', { orderId: id, customerName: order.customerName });
            return updated;
        });
    }
    async reject(id, userId, orgId, reason) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order || order.organizationId !== orgId)
            throw new common_1.NotFoundException();
        const nextStatus = this.stateMachine.transition(order.status, 'reject', client_1.Role.INVOICE_MAKER);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus, rejectionReason: reason },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, reason);
            await this.notifications.create(order.organizationId, client_1.Role.SALES_REP, 'order.rejected', { orderId: id, reason });
            return updated;
        });
    }
    async cancel(id, userId, orgId, reason, role) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!order || order.organizationId !== orgId)
            throw new common_1.NotFoundException();
        if (role === client_1.Role.SALES_REP && order.salesRepId !== userId) {
            throw new common_1.ForbiddenException();
        }
        if (role === client_1.Role.MANAGER || role === client_1.Role.OWNER) {
            if (!reason || reason.trim().length < 10) {
                throw new common_1.BadRequestException('Cancellation reason must be at least 10 characters');
            }
        }
        const nextStatus = this.stateMachine.transition(order.status, 'cancel', role);
        const stockDeductedStatuses = [
            client_1.OrderStatus.PICKING,
            client_1.OrderStatus.PACKED,
            client_1.OrderStatus.READY_FOR_DELIVERY,
        ];
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: {
                    status: nextStatus,
                    cancellationReason: reason || null,
                },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, reason ? `Cancelled: ${reason}` : 'Cancelled');
            if ((role === client_1.Role.MANAGER || role === client_1.Role.OWNER) && stockDeductedStatuses.includes(order.status)) {
                await this.warehouseService.reverseStockDeduction(tx, order);
            }
            return updated;
        });
    }
    async returnOrder(id, userId, orgId, reason) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!order || order.organizationId !== orgId)
            throw new common_1.NotFoundException();
        const nextStatus = this.stateMachine.transition(order.status, 'return', client_1.Role.MANAGER);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: {
                    status: nextStatus,
                    cancellationReason: reason || null,
                },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, reason ? `Returned: ${reason}` : 'Returned');
            await this.warehouseService.reverseStockDeduction(tx, order);
            return updated;
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        state_machine_service_1.StateMachineService,
        audit_service_1.AuditService,
        file_upload_service_1.FileUploadService,
        invoice_service_1.InvoiceService,
        warehouse_service_1.WarehouseService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map