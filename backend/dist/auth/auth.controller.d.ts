import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    requestEmailChange(req: any, dto: RequestEmailChangeDto): Promise<{
        message: string;
    }>;
}
