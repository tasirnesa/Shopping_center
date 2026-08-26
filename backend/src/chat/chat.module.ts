import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [JwtModule, ConfigModule],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule { }
