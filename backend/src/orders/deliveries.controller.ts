import {
    Controller,
    Get,
    Post,
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

/**
 * Deliveries controller — separate from OrdersController so that
 * Driver-facing endpoints live under /deliveries without requiring
 * access to the full orders module.
 *
 * Role-based scoping rules (Req 4.6, 4.9, 6.4):
 *  - DRIVER  → only sees deliveries where driverId = user.id
 *  - MANAGER → sees all deliveries scoped to organizationId
 */
@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
    constructor(
        private readonly deliveryService: DeliveryService,
        private readonly fileUploadService: FileUploadService,
    ) {}

    /**
     * GET /deliveries
     * DRIVER: returns only deliveries assigned to the requesting driver.
     * MANAGER: returns all deliveries in the organization.
     * Req 4.6, 4.9
     */
    @Get()
    @Roles(Role.DRIVER, Role.MANAGER, Role.OWNER)
    findAll(@Req() req: any) {
        return this.deliveryService.findAll(
            req.user.id,
            req.user.role,
            req.user.organizationId,
        );
    }

    /**
     * GET /deliveries/:id
     * DRIVER: forbidden if delivery.driverId !== user.id.
     * MANAGER: access to any delivery in the organization.
     * Req 4.9, 6.4, 6.6
     */
    @Get(':id')
    @Roles(Role.DRIVER, Role.MANAGER, Role.OWNER)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.deliveryService.findOne(
            id,
            req.user.id,
            req.user.role,
            req.user.organizationId,
        );
    }

    /**
     * POST /deliveries/:id/pickup
     * Assigns the driver and transitions:
     *   Delivery  → OUT_FOR_DELIVERY
     *   SalesOrder → OUT_FOR_DELIVERY
     * Only the DRIVER role may call this endpoint.
     * Req 4.2
     */
    @Post(':id/pickup')
    @Roles(Role.DRIVER, Role.OWNER)
    pickup(@Req() req: any, @Param('id') id: string) {
        // The :id here is the Delivery ID; DeliveryService.pickup looks up
        // the SalesOrder via the delivery record.
        return this.deliveryService.pickupByDeliveryId(
            id,
            req.user.id,
            req.user.organizationId,
        );
    }

    /**
     * POST /deliveries/:id/confirm
     * Requires a multipart file upload (delivery confirmation document/photo).
     * Calls DeliveryService.confirmDelivery which:
     *   - validates the file is present (Req 4.8)
     *   - sets confirmationPath / confirmedAt / confirmedById on Delivery
     *   - transitions Delivery  → DELIVERED
     *   - transitions SalesOrder → DELIVERED → COMPLETED  (Req 4.3, 4.4)
     * Only the assigned DRIVER may call this.
     * Req 4.3, 4.4, 4.8, 9.4
     */
    @Post(':id/confirm')
    @Roles(Role.DRIVER, Role.OWNER)
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async confirmDelivery(
        @Req() req: any,
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Req 4.8: file is mandatory — return 400 before hitting the service
        if (!file) {
            throw new BadRequestException(
                'Delivery confirmation file upload is required',
            );
        }

        this.fileUploadService.validateFile(file);

        const subPath = path.join(req.user.organizationId, id, 'delivery');
        const confirmationPath = await this.fileUploadService.store(
            file,
            subPath,
            'DELIVERY_CONFIRMATION',
        );

        return this.deliveryService.confirmDeliveryById(
            id,
            req.user.id,
            req.user.organizationId,
            confirmationPath,
        );
    }
}
