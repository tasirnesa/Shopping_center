import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { OrdersController } from './orders.controller';
import { InvoicesController } from './invoices.controller';
import { DeliveriesController } from './deliveries.controller';
import { OrdersService } from './orders.service';
import { StateMachineService } from './state-machine.service';
import { AuditService } from './audit.service';
import { FileUploadService } from './file-upload.service';
import { InvoiceService } from './invoice.service';
import { WarehouseService } from './warehouse.service';
import { DeliveryService } from './delivery.service';
import { OrderOwnerGuard } from './order-owner.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        PrismaModule,
        MulterModule.register({ storage: memoryStorage() }),
        NotificationsModule,
    ],
    controllers: [OrdersController, InvoicesController, DeliveriesController],
    providers: [
        OrdersService,
        StateMachineService,
        AuditService,
        FileUploadService,
        InvoiceService,
        WarehouseService,
        DeliveryService,
        OrderOwnerGuard,
    ],
})
export class OrdersModule { }
