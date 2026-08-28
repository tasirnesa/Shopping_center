"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    notificationsService;
    constructor(prisma, jwtService, notificationsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async validateUser(email, pass) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { organization: true, branch: true },
        });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            organizationId: user.organizationId,
            branchId: user.branchId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: user.organizationId,
                branchId: user.branchId,
                organization: user.organization
                    ? {
                        id: user.organization.id,
                        name: user.organization.name,
                        businessType: user.organization.businessType,
                    }
                    : null,
                branch: user.branch
                    ? {
                        id: user.branch.id,
                        name: user.branch.name,
                    }
                    : null,
            },
        };
    }
    async register(registerDto) {
        try {
            if (registerDto.organizationId) {
                const org = await this.prisma.organization.findUnique({
                    where: { id: registerDto.organizationId },
                });
                if (!org) {
                    throw new common_1.BadRequestException('Invalid Organization ID.');
                }
            }
            if (registerDto.branchId) {
                const branch = await this.prisma.branch.findUnique({
                    where: { id: registerDto.branchId },
                });
                if (!branch) {
                    throw new common_1.BadRequestException('Invalid Branch ID.');
                }
                if (registerDto.organizationId &&
                    branch.organizationId !== registerDto.organizationId) {
                    throw new common_1.BadRequestException('Branch does not belong to the specified organization.');
                }
            }
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email: registerDto.email,
                    password: hashedPassword,
                    name: registerDto.name,
                    role: registerDto.role,
                    organizationId: registerDto.organizationId,
                    branchId: registerDto.branchId?.trim(),
                },
            });
            const { password, ...result } = user;
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Email is already registered!');
            }
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('Invalid Organization or Branch ID.');
            }
            throw new common_1.InternalServerErrorException('Server Error: ' + error.message);
        }
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!passwordMatch)
            throw new common_1.BadRequestException('Current password is incorrect');
        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
        return { message: 'Password changed successfully' };
    }
    async requestEmailChange(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (!user.organizationId)
            throw new common_1.BadRequestException('Organization not found for user');
        const payload = {
            message: `User ${user.name} (${user.email}) requested an email change to ${dto.newEmail}. Reason: ${dto.reason}`,
            userId: user.id,
            currentEmail: user.email,
            newEmail: dto.newEmail,
            reason: dto.reason,
        };
        await this.notificationsService.create(user.organizationId, client_1.Role.OWNER, 'EMAIL_CHANGE_REQUEST', payload);
        return { message: 'Your email change request has been sent to the administrator.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map