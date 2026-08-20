import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(organizationId: string, targetRole: Role, type: string, payload: any): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        read: boolean;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findUnread(organizationId: string, role: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        read: boolean;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    markAsRead(id: string, organizationId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        read: boolean;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
