import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { WarehouseService } from './warehouse.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { FileUploadService } from './file-upload.service';
import { InvoiceService } from './invoice.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as path from 'path';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stateMachine: StateMachineService,
        private readonly audit: AuditService,
        private readonly fileUpload: FileUploadService,
        private readonly invoiceService: InvoiceService,
        private readonly warehouseService: WarehouseService,
        private readonly notifications: NotificationsService,
    ) { }

    computeLineTotal(unitPrice: number, quantity: number, discount: number = 0): number {
        return (unitPrice * quantity) - discount;
    }

    async create(userId: string, orgId: string, dto: CreateOrderDto) {
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
                    customerId: dto.customerId,
                    customerName: dto.customerName,
                    tin: dto.tin,
                    deliveryAddress: dto.deliveryAddress,
                    customerPhone: dto.customerPhone,
                    paymentMethod: dto.paymentMethod,
                    chequeNumber: dto.chequeNumber,
                    creditDueDate: dto.creditDueDate,
                    paymentTerm: dto.paymentTerm,
                    status: OrderStatus.DRAFT,
                    subtotal,
                    taxRate,
                    taxAmount,
                    grandTotal,
                    lines: {
                        create: mappedLines,
                    },
                },
            });

            if (dto.customerId) {
                const customer = await tx.customer.findUnique({ where: { id: dto.customerId } });
                if (customer?.efdaLicensePath) {
                    await tx.attachment.create({
                        data: {
                            salesOrderId: order.id,
                            type: 'EFDA_LICENSE' as any,
                            fileName: customer.efdaLicenseFileName || 'efda_license.pdf',
                            filePath: customer.efdaLicensePath,
                            mimeType: 'application/pdf',
                            fileSize: 0,
                            uploadedById: userId,
                        }
                    });
                }
            }

            await this.audit.recordTransition(tx, order.id, null, OrderStatus.DRAFT, userId, 'Order created');

            return order;
        });
    }

    async findAll(userId: string, role: Role, orgId: string) {
        if (role === Role.SALES_REP) {
            return this.prisma.salesOrder.findMany({
                where: { salesRepId: userId },
                include: { lines: { include: { product: true } }, attachments: true, invoice: { select: { id: true, invoiceNumber: true } }, statusEvents: { orderBy: { createdAt: 'asc' } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        // INVOICE_MAKER sees only SUBMITTED orders sorted oldest first (Req 2.9)
        if (role === Role.INVOICE_MAKER) {
            return this.prisma.salesOrder.findMany({
                where: { organizationId: orgId, status: OrderStatus.SUBMITTED },
                include: { lines: { include: { product: true } }, attachments: true, invoice: { select: { id: true, invoiceNumber: true } } },
                orderBy: { createdAt: 'asc' },
            });
        }
        // All other permitted roles see full org scope
        return this.prisma.salesOrder.findMany({
            where: { organizationId: orgId },
            include: { lines: { include: { product: true } }, attachments: true, invoice: { select: { id: true, invoiceNumber: true } }, statusEvents: { orderBy: { createdAt: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string, role: Role, orgId: string) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: {
                lines: { include: { product: true } },
                attachments: true,
                statusEvents: { orderBy: { createdAt: 'asc' }, include: { actor: true } },
            },
        });

        if (!order) {
            throw new NotFoundException(`Order ${id} not found`);
        }

        if (order.organizationId !== orgId) {
            throw new ForbiddenException();
        }

        if (role === Role.SALES_REP && order.salesRepId !== userId) {
            throw new ForbiddenException(`Orders can only be accessed by their owner`);
        }
        return order;
    }

    async update(id: string, userId: string, dto: UpdateOrderDto) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order) throw new NotFoundException();
        if (order.status !== OrderStatus.DRAFT) throw new BadRequestException(`Cannot update non-draft order`);

        // SALES_REP can only update their own orders
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === Role.SALES_REP && order.salesRepId !== userId) {
            throw new ForbiddenException();
        }

        const updateData: Record<string, any> = {};
        if (dto.customerName !== undefined) updateData.customerName = dto.customerName;
        if (dto.tin !== undefined) updateData.tin = dto.tin;
        if (dto.deliveryAddress !== undefined) updateData.deliveryAddress = dto.deliveryAddress;
        if (dto.customerPhone !== undefined) updateData.customerPhone = dto.customerPhone;
        if (dto.branchId !== undefined) updateData.branchId = dto.branchId;
        if (dto.customerId !== undefined) updateData.customerId = dto.customerId;
        if (dto.paymentMethod !== undefined) updateData.paymentMethod = dto.paymentMethod;
        if (dto.chequeNumber !== undefined) updateData.chequeNumber = dto.chequeNumber;
        if (dto.creditDueDate !== undefined) updateData.creditDueDate = dto.creditDueDate;
        if (dto.paymentTerm !== undefined) updateData.paymentTerm = dto.paymentTerm;

        // Recompute totals if lines are provided
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
                // Delete existing lines and recreate
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

    async submit(id: string, userId: string, orgId: string) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { attachments: true, lines: true },
        });

        if (!order) throw new NotFoundException();
        if (order.organizationId !== orgId) throw new ForbiddenException();

        // SALES_REP can only submit their own orders
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === Role.SALES_REP && order.salesRepId !== userId) {
            throw new ForbiddenException();
        }

        if (!order.customerName || !order.tin || !order.deliveryAddress || order.lines.length === 0) {
            throw new BadRequestException('Order is missing mandatory fields');
        }

        const hasTradeLicense = order.attachments.some(a => a.type === 'TRADE_LICENSE');
        const hasPaymentReceipt = order.attachments.some(a => a.type === 'PAYMENT_RECEIPT');
        if (!hasTradeLicense) {
            throw new BadRequestException('Order must have EFDA License attachment before submitting');
        }

        if (order.paymentMethod === 'CASH' || order.paymentMethod === 'CHEQUE') {
            if (!hasPaymentReceipt) {
                throw new BadRequestException('Order must have Payment Receipt attachment for Cash/Cheque payments');
            }
        }

        if (order.paymentMethod === 'CHEQUE' && !order.chequeNumber) {
            throw new BadRequestException('Cheque number is required for CHEQUE payment method');
        }

        if (order.paymentMethod === 'CREDIT' && !order.creditDueDate) {
            throw new BadRequestException('Credit due date is required for CREDIT payment method');
        }

        const nextStatus = this.stateMachine.transition(order.status, 'submit', Role.SALES_REP);

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, 'Order submitted');
            await this.notifications.create(order.organizationId, Role.INVOICE_MAKER, 'order.submitted', { orderId: id, customerName: order.customerName });
            return updated;
        });
    }

    async uploadAttachment(id: string, userId: string, orgId: string, type: any, file: any) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order) throw new NotFoundException();
        if (order.organizationId !== orgId) throw new ForbiddenException();

        // Only the order owner (SALES_REP) or elevated roles can upload
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === Role.SALES_REP && order.salesRepId !== userId) {
            throw new ForbiddenException('Only the order owner can upload attachments');
        }

        if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.SUBMITTED) {
            throw new BadRequestException('Cannot upload attachments after order processing has started');
        }

        this.fileUpload.validateFile(file);
        const subPath = path.join(orgId, id);
        const storedPath = await this.fileUpload.store(file, subPath, type);

        const created = await this.prisma.attachment.create({
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

        if (type === 'TRADE_LICENSE' && order.customerId) {
            await this.prisma.customer.update({
                where: { id: order.customerId },
                data: {
                    efdaLicensePath: storedPath,
                    efdaLicenseFileName: file.originalname,
                },
            });
        }

        return created;
    }

    async getAttachment(orderId: string, attachmentId: string, orgId: string) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: { salesOrder: true },
        });
        if (!attachment || attachment.salesOrderId !== orderId) {
            throw new NotFoundException('Attachment not found');
        }
        if (attachment.salesOrder.organizationId !== orgId) {
            throw new ForbiddenException();
        }
        return attachment;
    }

    async approve(id: string, userId: string, orgId: string) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { attachments: true, lines: true },
        });

        if (!order) throw new NotFoundException();
        if (order.organizationId !== orgId) throw new ForbiddenException();

        this.stateMachine.transition(order.status, 'approve', Role.INVOICE_MAKER);

        return this.prisma.$transaction(async (tx) => {
            await this.audit.recordTransition(tx, id, order.status, OrderStatus.WAITING_FOR_INVOICE, userId, 'Approval step 1');
            await this.audit.recordTransition(tx, id, OrderStatus.WAITING_FOR_INVOICE, OrderStatus.INVOICE_APPROVED, userId, 'Approval step 2');

            const nextStatus = OrderStatus.WAITING_FOR_WAREHOUSE;
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus },
            });

            await this.audit.recordTransition(tx, id, OrderStatus.INVOICE_APPROVED, nextStatus, userId, 'Sent to warehouse');

            await this.invoiceService.generateInvoice(tx, order, userId, orgId);

            // Notify Store Man that order is waiting for warehouse (Req 2.3, 8.2)
            await this.notifications.create(orgId, Role.STORE_MAN, 'order.invoice_approved', { orderId: id, customerName: order.customerName });

            return updated;
        });
    }

    async reject(id: string, userId: string, orgId: string, reason: string) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id } });
        if (!order || order.organizationId !== orgId) throw new NotFoundException();

        const nextStatus = this.stateMachine.transition(order.status, 'reject', Role.INVOICE_MAKER);

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: { status: nextStatus, rejectionReason: reason },
            });
            await this.audit.recordTransition(tx, id, order.status, nextStatus, userId, reason);
            // Notify Sales Rep their order was rejected
            await this.notifications.create(order.organizationId, Role.SALES_REP, 'order.rejected', { orderId: id, reason });
            return updated;
        });
    }

    async cancel(id: string, userId: string, orgId: string, reason: string, role: Role) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!order || order.organizationId !== orgId) throw new NotFoundException();

        // SALES_REP can only cancel their own orders (additional ownership check beyond guard)
        if (role === Role.SALES_REP && order.salesRepId !== userId) {
            throw new ForbiddenException();
        }

        // MANAGER and OWNER must provide a cancellation reason with at least 10 characters (Req 5.2)
        if (role === Role.MANAGER || role === Role.OWNER) {
            if (!reason || reason.trim().length < 10) {
                throw new BadRequestException('Cancellation reason must be at least 10 characters');
            }
        }

        // Validate transition via state machine (enforces allowed statuses per role)
        const nextStatus = this.stateMachine.transition(order.status, 'cancel', role);

        // Statuses where stock has already been deducted (Req 5.3)
        const stockDeductedStatuses: OrderStatus[] = [
            OrderStatus.PICKING,
            OrderStatus.PACKED,
            OrderStatus.READY_FOR_DELIVERY,
        ];

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: {
                    status: nextStatus,
                    cancellationReason: reason || null,
                },
            });

            await this.audit.recordTransition(
                tx, id, order.status, nextStatus, userId,
                reason ? `Cancelled: ${reason}` : 'Cancelled',
            );

            // If stock was deducted, reverse it (MANAGER/OWNER cancellation only — Req 5.3)
            if ((role === Role.MANAGER || role === Role.OWNER) && stockDeductedStatuses.includes(order.status)) {
                await this.warehouseService.reverseStockDeduction(tx, order);
            }

            return updated;
        });
    }

    async returnOrder(id: string, userId: string, orgId: string, reason: string) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!order || order.organizationId !== orgId) throw new NotFoundException();

        // Validate transition: only COMPLETED or DELIVERED → RETURNED (Req 5.4)
        const nextStatus = this.stateMachine.transition(order.status, 'return', Role.MANAGER);

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.salesOrder.update({
                where: { id },
                data: {
                    status: nextStatus,
                    cancellationReason: reason || null,
                },
            });

            await this.audit.recordTransition(
                tx, id, order.status, nextStatus, userId,
                reason ? `Returned: ${reason}` : 'Returned',
            );

            // Create compensating IN transactions for each order line (Req 5.4, 9.3)
            await this.warehouseService.reverseStockDeduction(tx, order);

            return updated;
        });
    }
}
