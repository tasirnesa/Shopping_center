import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantStorage } from './tenant.storage';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // populated by JwtAuthGuard

        let orgId = null;
        let role = null;

        if (user && user.organizationId) {
            orgId = user.organizationId;
            role = user.role;
        }

        // Explicit override for system admins switching contexts
        if (request.headers['x-organization-id']) {
            orgId = request.headers['x-organization-id'];
        }

        // If there's an orgId in the request, we run the rest of the request inside the tenantStorage context.
        // If not, we still run it, just with null values, so Prisma knows not to inject anything.
        return new Observable((subscriber) => {
            tenantStorage.run({ organizationId: orgId, role }, () => {
                next.handle().subscribe(subscriber);
            });
        });
    }
}
