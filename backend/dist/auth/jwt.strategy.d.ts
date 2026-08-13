import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        organizationId: string | null;
        branchId: string | null;
        organization: {
            email: string | null;
            name: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            businessType: string | null;
            tin: string | null;
            phone: string | null;
            address: string | null;
            logo: string | null;
        } | null;
        branch: {
            name: string;
            organizationId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            code: string | null;
        } | null;
    }>;
}
export {};
