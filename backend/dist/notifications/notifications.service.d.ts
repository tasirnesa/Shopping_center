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
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
        createdAt: Date;
    }>;
    findUnread(organizationId: string | null, role: string): Promise<{
        organizationId: string;
        id: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
        createdAt: Date;
    }[]>;
    markAsRead(id: string, organizationId: string): Promise<{
        organizationId: string;
        id: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
        createdAt: Date;
    }>;
}
