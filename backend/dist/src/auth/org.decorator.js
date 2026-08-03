"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.CurrentBranch = exports.CurrentOrg = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentOrg = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (user?.role === 'SYSTEM_ADMIN') {
        const headerOrg = request.headers['x-organization-id'];
        if (headerOrg)
            return headerOrg;
    }
    return user?.organizationId || null;
});
exports.CurrentBranch = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.branchId || null;
});
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=org.decorator.js.map