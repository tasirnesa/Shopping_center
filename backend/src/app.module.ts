import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { FoundationModule } from './foundation/foundation.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationModule,
    ProductModule,
    SalesModule,
    InventoryModule,
    FoundationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
