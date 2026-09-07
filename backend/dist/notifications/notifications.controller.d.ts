import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<{
        organizationId: string;
        id: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
        createdAt: Date;
    }[]>;
    markRead(id: string, req: any): Promise<{
        organizationId: string;
        id: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
        createdAt: Date;
    }>;
}
