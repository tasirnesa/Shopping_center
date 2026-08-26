import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => ChatGateway))
        private chatGateway: ChatGateway,
    ) { }

    async getUsers(user: any) {
        // Get all active users in the same organization (except the current user)
        const orgUsers = await this.prisma.user.findMany({
            where: {
                id: { not: user.id },
                status: 'ACTIVE',
                organizationId: user.organizationId,
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
        });

        // Map each user to a chat contact format
        const contacts = await Promise.all(
            orgUsers.map(async (u) => {
                // Fetch last message between current user and this user
                const lastMessage = await this.prisma.internalMessage.findFirst({
                    where: {
                        OR: [
                            { senderId: user.id, receiverId: u.id },
                            { senderId: u.id, receiverId: user.id },
                        ],
                    },
                    orderBy: { createdAt: 'desc' },
                });

                // Count unread messages (from them to me)
                const unreadCount = await this.prisma.internalMessage.count({
                    where: {
                        senderId: u.id,
                        receiverId: user.id,
                        read: false,
                    },
                });

                return {
                    id: u.id,
                    name: u.name || u.role,
                    role: u.role,
                    lastMessage: lastMessage ? lastMessage.content : 'New Contact',
                    time: lastMessage ? lastMessage.createdAt : null, // formatting will be done on the client
                    unread: unreadCount,
                    online: false, // We'll mock online status or figure it out later via websockets
                };
            })
        );

        // Sort by most recent message first if time exists
        return contacts.sort((a, b) => {
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeB - timeA;
        });
    }

    async getHistory(user: any, partnerId: string) {
        // Mark as read any unread messages from them to me
        await this.prisma.internalMessage.updateMany({
            where: {
                senderId: partnerId,
                receiverId: user.id,
                read: false,
            },
            data: { read: true },
        });

        const messages = await this.prisma.internalMessage.findMany({
            where: {
                OR: [
                    { senderId: user.id, receiverId: partnerId },
                    { senderId: partnerId, receiverId: user.id },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });

        return messages.map(m => ({
            id: m.id,
            text: m.content,
            sender: m.senderId === user.id ? 'me' : 'them',
            time: m.createdAt,
        }));
    }

    async sendMessage(user: any, recipientId: string, text: string) {
        // Ensure recipient exists AND belongs to the same organization
        const recipient = await this.prisma.user.findFirst({
            where: { id: recipientId, organizationId: user.organizationId },
        });
        if (!recipient) {
            throw new NotFoundException('Recipient not found in your organization');
        }

        const msg = await this.prisma.internalMessage.create({
            data: {
                organizationId: user.organizationId,
                senderId: user.id,
                receiverId: recipientId,
                content: text,
            },
        });

        const responseMsg = {
            id: msg.id,
            text: msg.content,
            sender: 'me',
            time: msg.createdAt,
        };

        // Emit via Gateway to the recipient
        const recipientMsg = { ...responseMsg, sender: 'them', originalSenderId: user.id };
        this.chatGateway.sendToUser(recipientId, 'newMessage', recipientMsg);

        return responseMsg;
    }
}
