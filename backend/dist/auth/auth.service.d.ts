import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
        organizationId: string | null;
        branchId: string | null;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
