import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';/**
 * Extract the current user's organizationId from the JWT-authenticated request.
 * Usage: @CurrentOrg() orgId: string
 */
export const CurrentOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (user?.role === 'SYSTEM_ADMIN') {
      const headerOrg = request.headers['x-organization-id'];
      if (headerOrg) return headerOrg;
      throw new BadRequestException(
        'Organization context (x-organization-id) is required for SYSTEM_ADMIN.',
      );
    }
    return user?.organizationId || null;
  },
);

/**
 * Extract the current user's branchId from the JWT-authenticated request.
 * Usage: @CurrentBranch() branchId: string
 */
export const CurrentBranch = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.branchId || null;
  },
);

/**
 * Extract the full authenticated user from the request.
 * Usage: @CurrentUser() user: any
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
