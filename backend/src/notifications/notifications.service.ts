import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(organizationId: string, targetRole: Role, type: string, payload: any) {
        return this.prisma.notification.create({
            data: {
                organizationId,
                targetRole,
                type,
                payload,
            },
        });
    }

    async findUnread(organizationId: string, role: string) {
        return this.prisma.notification.findMany({
            where: {
                organizationId,
                targetRole: role,
                read: false,
            },
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
