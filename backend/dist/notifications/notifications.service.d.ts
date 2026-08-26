import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(organizationId: string, targetRole: Role, type: string, payload: any): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
    findUnread(organizationId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }[]>;
    markAsRead(id: string, organizationId: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        type: string;
        targetRole: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        read: boolean;
    }>;
}
