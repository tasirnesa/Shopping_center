import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
export declare class ChatService {
    private prisma;
    private chatGateway;
    constructor(prisma: PrismaService, chatGateway: ChatGateway);
    getUsers(user: any): Promise<{
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        lastMessage: string;
        time: Date | null;
        unread: number;
        online: boolean;
    }[]>;
    getHistory(user: any, partnerId: string): Promise<{
        id: string;
        text: string;
        sender: string;
        time: Date;
    }[]>;
    sendMessage(user: any, recipientId: string, text: string): Promise<{
        id: string;
        text: string;
        sender: string;
        time: Date;
    }>;
}
