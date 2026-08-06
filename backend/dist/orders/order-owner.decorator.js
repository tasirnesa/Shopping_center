"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOwner = OrderOwner;
const common_1 = require("@nestjs/common");
const order_owner_guard_1 = require("./order-owner.guard");
function OrderOwner() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(order_owner_guard_1.OrderOwnerGuard));
}
//# sourceMappingURL=order-owner.decorator.js.map