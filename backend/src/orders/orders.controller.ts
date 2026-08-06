import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, BadRequestException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { OrdersService } from './orders.service';
import { WarehouseService } from './warehouse.service';
import { DeliveryService } from './delivery.service';
import { FileUploadService } from './file-upload.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RejectOrderDto } from './dto/reject-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ReturnOrderDto } from './dto/return-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderOwner } from './order-owner.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly warehouseService: WarehouseService,
        private readonly deliveryService: DeliveryService,
        private readonly fileUploadService: FileUploadService,
    ) { }

    @Post()
    @Roles(Role.SALES_REP, Role.OWNER)
    create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user.id, req.user.organizationId, createOrderDto);
    }

    @Get()
    @Roles(Role.SALES_REP, Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER, Role.OWNER)
    findAll(@Req() req: any) {
        return this.ordersService.findAll(req.user.id, req.user.role, req.user.organizationId);
    }

    @Get(':id')
    @Roles(Role.SALES_REP, Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER, Role.OWNER, Role.DRIVER)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.findOne(id, req.user.id, req.user.role, req.user.organizationId);
    }

    @Patch(':id')
    @Roles(Role.SALES_REP, Role.OWNER)
    @OrderOwner()
    update(@Req() req: any, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(id, req.user.id, updateOrderDto);
    }

    @Post(':id/submit')
    @Roles(Role.SALES_REP, Role.OWNER)
    @OrderOwner()
    submit(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.submit(id, req.user.id, req.user.organizationId);
    }

    @Post(':id/approve')
    @Roles(Role.INVOICE_MAKER, Role.OWNER)
    approve(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.approve(id, req.user.id, req.user.organizationId);
    }

    @Post(':id/reject')
    @Roles(Role.INVOICE_MAKER, Role.OWNER)
    reject(@Req() req: any, @Param('id') id: string, @Body() rejectDto: RejectOrderDto) {
        return this.ordersService.reject(id, req.user.id, req.user.organizationId, rejectDto.reason);
    }

    @Post(':id/cancel')
    @Roles(Role.SALES_REP, Role.MANAGER, Role.OWNER)
    cancel(@Req() req: any, @Param('id') id: string, @Body() cancelDto: CancelOrderDto) {
        return this.ordersService.cancel(id, req.user.id, req.user.organizationId, cancelDto.reason ?? '', req.user.role);
    }

    @Post(':id/return')
    @Roles(Role.MANAGER, Role.OWNER)
    returnOrder(@Req() req: any, @Param('id') id: string, @Body() returnDto: ReturnOrderDto) {
        return this.ordersService.returnOrder(id, req.user.id, req.user.organizationId, returnDto.reason ?? '');
    }

    @Post(':id/pick')
    @Roles(Role.STORE_MAN, Role.OWNER)
    startPicking(@Req() req: any, @Param('id') id: string) {
        return this.warehouseService.startPicking(id, req.user.id, req.user.organizationId);
    }

    @Post(':id/pack')
    @Roles(Role.STORE_MAN, Role.OWNER)
    confirmPicking(@Req() req: any, @Param('id') id: string) {
        return this.warehouseService.confirmPickingForOrder(id, req.user.id, req.user.organizationId);
    }

    @Post(':id/pickup')
    @Roles(Role.DRIVER, Role.OWNER)
    pickup(@Req() req: any, @Param('id') id: string) {
        return this.deliveryService.pickup(id, req.user.id, req.user.organizationId);
    }

    @Post(':id/deliver')
    @Roles(Role.DRIVER, Role.OWNER)
    @UseInterceptors(FileInterceptor('file'))
    async confirmDelivery(
        @Req() req: any,
        @Param('id') id: string,
        @UploadedFile() file: any,
    ) {
        let confirmationPath: string | undefined;
        if (file) {
            this.fileUploadService.validateFile(file);
            const subPath = path.join(req.user.organizationId, id, 'delivery');
            confirmationPath = await this.fileUploadService.store(file, subPath);
        }
        return this.deliveryService.confirmDelivery(id, req.user.id, req.user.organizationId, confirmationPath);
    }

    @Post(':id/attachments')
    @Roles(Role.SALES_REP, Role.OWNER)
    @OrderOwner()
    @UseInterceptors(FileInterceptor('file'))
    uploadAttachment(
        @Req() req: any,
        @Param('id') id: string,
        @Body('type') type: string,
        @UploadedFile() file: any,
    ) {
        if (!file) throw new BadRequestException('File is required');
        if (!type) throw new BadRequestException('Attachment type is required');
        return this.ordersService.uploadAttachment(id, req.user.id, req.user.organizationId, type, file);
    }

    @Get(':id/attachments/:attachmentId')
    @Roles(Role.SALES_REP, Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER, Role.DRIVER, Role.OWNER)
    async downloadAttachment(
        @Req() req: any,
        @Param('id') id: string,
        @Param('attachmentId') attachmentId: string,
        @Res() res: any,
    ) {
        const attachment = await this.ordersService.getAttachment(id, attachmentId, req.user.organizationId);
        res.setHeader('Content-Type', attachment.mimeType);
        res.sendFile(attachment.filePath, { root: '.' });
    }
}
