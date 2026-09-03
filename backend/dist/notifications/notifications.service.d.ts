import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(organizationId: string, targetRole: Role, type: string, payload: any): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
    findUnread(organizationId: string | null, role: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }[]>;
    markAsRead(id: string, organizationId: string): Promise<{
        organizationId: string;
        id: string;
        createdAt: Date;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
}
