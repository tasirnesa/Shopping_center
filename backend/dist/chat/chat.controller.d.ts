import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatUsers(req: any): Promise<{
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        lastMessage: string;
        time: Date | null;
        unread: number;
        online: boolean;
    }[]>;
    getChatHistory(req: any, partnerId: string): Promise<{
        id: string;
        text: string;
        sender: string;
        time: Date;
    }[]>;
    sendMessage(req: any, recipientId: string, body: {
        text: string;
    }): Promise<{
        id: string;
        text: string;
        sender: string;
        time: Date;
    }>;
}
