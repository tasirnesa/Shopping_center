"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_gateway_1 = require("./chat.gateway");
let ChatService = class ChatService {
    prisma;
    chatGateway;
    constructor(prisma, chatGateway) {
        this.prisma = prisma;
        this.chatGateway = chatGateway;
    }
    async getUsers(user) {
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
        const contacts = await Promise.all(orgUsers.map(async (u) => {
            const lastMessage = await this.prisma.internalMessage.findFirst({
                where: {
                    OR: [
                        { senderId: user.id, receiverId: u.id },
                        { senderId: u.id, receiverId: user.id },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            });
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
                time: lastMessage ? lastMessage.createdAt : null,
                unread: unreadCount,
                online: false,
            };
        }));
        return contacts.sort((a, b) => {
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeB - timeA;
        });
    }
    async getHistory(user, partnerId) {
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
    async sendMessage(user, recipientId, text) {
        const recipient = await this.prisma.user.findFirst({
            where: { id: recipientId, organizationId: user.organizationId },
        });
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found in your organization');
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
        const recipientMsg = { ...responseMsg, sender: 'them', originalSenderId: user.id };
        this.chatGateway.sendToUser(recipientId, 'newMessage', recipientMsg);
        return responseMsg;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway])
], ChatService);
//# sourceMappingURL=chat.service.js.map