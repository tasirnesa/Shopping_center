import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private notificationsService;
    constructor(prisma: PrismaService, jwtService: JwtService, notificationsService: NotificationsService);
    validateUser(email: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            organizationId: any;
            branchId: any;
            organization: {
                id: any;
                name: any;
                businessType: any;
            } | null;
            branch: {
                id: any;
                name: any;
            } | null;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string | null;
        name: string | null;
        email: string;
        branchId: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        updatedAt: Date;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    requestEmailChange(userId: string, dto: RequestEmailChangeDto): Promise<{
        message: string;
    }>;
}
