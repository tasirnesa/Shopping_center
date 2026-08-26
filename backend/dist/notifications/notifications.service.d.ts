import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(organizationId: string, targetRole: Role, type: string, payload: any): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
    findUnread(organizationId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }[]>;
    markAsRead(id: string, organizationId: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        targetRole: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
}
