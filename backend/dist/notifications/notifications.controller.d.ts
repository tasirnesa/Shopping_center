import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }[]>;
    markRead(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
}
