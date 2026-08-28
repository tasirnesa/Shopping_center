import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsGateway: NotificationsGateway
    ) { }

    async create(organizationId: string, targetRole: Role, type: string, payload: any) {
        const notif = await this.prisma.notification.create({
            data: {
                organizationId,
                targetRole,
                type,
                payload,
            },
        });
        this.notificationsGateway.notifyRole(organizationId, targetRole);
        return notif;
    }

    async findUnread(organizationId: string | null, role: string) {
        const where: any = {
            targetRole: role as Role,
            read: false,
        };
        // SYSTEM_ADMIN has no organizationId — skip org filter so Prisma doesn't reject null
        if (organizationId) {
            where.organizationId = organizationId;
        }
        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string, organizationId: string) {
        const notif = await this.prisma.notification.findUnique({ where: { id } });
        if (!notif || notif.organizationId !== organizationId) {
            throw new NotFoundException('Notification not found');
        }
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
}
