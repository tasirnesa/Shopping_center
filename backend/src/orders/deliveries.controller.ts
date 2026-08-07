import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as path from 'path';
import { DeliveryService } from './delivery.service';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
    constructor(
        private readonly deliveryService: DeliveryService,
        private readonly fileUploadService: FileUploadService,
    ) {}

    /** GET /deliveries — DRIVER sees available+own, MANAGER sees all org */
    @Get()
    @Roles(Role.DRIVER, Role.MANAGER, Role.OWNER)
    findAll(@Req() req: any) {
        return this.deliveryService.findAll(req.user.id, req.user.role, req.user.organizationId);
    }

    /** GET /deliveries/:id */
    @Get(':id')
    @Roles(Role.DRIVER, Role.MANAGER, Role.OWNER)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.deliveryService.findOne(id, req.user.id, req.user.role, req.user.organizationId);
    }

    /** POST /deliveries/:id/pickup — assigns driver and transitions to OUT_FOR_DELIVERY */
    @Post(':id/pickup')
    @Roles(Role.DRIVER, Role.OWNER)
    pickup(@Req() req: any, @Param('id') id: string) {
        return this.deliveryService.pickupByDeliveryId(id, req.user.id, req.user.organizationId);
    }

    /**
     * POST /deliveries/:id/confirm — multipart file upload confirmation
     * Accepts photo or PDF as proof of delivery.
     */
    @Post(':id/confirm')
    @Roles(Role.DRIVER, Role.OWNER)
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async confirmDelivery(
        @Req() req: any,
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Delivery confirmation file upload is required');
        }

        this.fileUploadService.validateFile(file);

        const subPath = path.join(req.user.organizationId, id, 'delivery');
        const confirmationPath = await this.fileUploadService.store(file, subPath, 'DELIVERY_CONFIRMATION');

        return this.deliveryService.confirmDeliveryById(id, req.user.id, req.user.organizationId, confirmationPath);
    }

    /**
     * POST /deliveries/:id/confirm-note — JSON-based confirmation (no file required).
     * Used by mobile clients where multipart upload is not reliable.
     * Stores a text note as the confirmation record.
     */
    @Post(':id/confirm-note')
    @Roles(Role.DRIVER, Role.OWNER)
    async confirmDeliveryNote(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: { note?: string },
    ) {
        const confirmationPath = `note:${body.note?.trim() || 'Confirmed by driver'} — ${new Date().toISOString()}`;
        return this.deliveryService.confirmDeliveryById(id, req.user.id, req.user.organizationId, confirmationPath);
    }
}
