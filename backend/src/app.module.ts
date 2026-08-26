import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { FoundationModule } from './foundation/foundation.module';
import { OrganizationModule } from './organization/organization.module';
import { CustomersModule } from './customers/customers.module';
import { ExpensesModule } from './expenses/expenses.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TenantInterceptor } from './prisma/tenant.interceptor';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationModule,
    ProductModule,
    SalesModule,
    InventoryModule,
    FoundationModule,
    CustomersModule,
    ExpensesModule,
    OrdersModule,
    NotificationsModule,
    ChatModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule { }
