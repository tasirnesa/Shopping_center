import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { FileUploadService } from '../orders/file-upload.service';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, FileUploadService],
  exports: [CustomersService],
})
export class CustomersModule {}
