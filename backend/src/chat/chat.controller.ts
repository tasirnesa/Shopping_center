import { Controller, Get, Post, Body, Param, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('users')
    getChatUsers(@Req() req) {
        return this.chatService.getUsers(req.user);
    }

    @Get(':userId')
    getChatHistory(@Req() req, @Param('userId') partnerId: string) {
        return this.chatService.getHistory(req.user, partnerId);
    }

    @Post(':userId')
    sendMessage(@Req() req, @Param('userId') recipientId: string, @Body() body: { text: string }) {
        if (!body.text || !body.text.trim()) {
            throw new HttpException('Message text is required', HttpStatus.BAD_REQUEST);
        }
        return this.chatService.sendMessage(req.user, recipientId, body.text);
    }
}
