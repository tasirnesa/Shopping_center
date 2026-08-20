import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        read: boolean;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    markRead(id: string, req: any): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        read: boolean;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
