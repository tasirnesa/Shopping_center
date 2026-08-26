import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
        branchId: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
