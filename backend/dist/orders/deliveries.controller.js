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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = __importStar(require("path"));
const delivery_service_1 = require("./delivery.service");
const file_upload_service_1 = require("./file-upload.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let DeliveriesController = class DeliveriesController {
    deliveryService;
    fileUploadService;
    constructor(deliveryService, fileUploadService) {
        this.deliveryService = deliveryService;
        this.fileUploadService = fileUploadService;
    }
    findAll(req) {
        return this.deliveryService.findAll(req.user.id, req.user.role, req.user.organizationId);
    }
    findOne(req, id) {
        return this.deliveryService.findOne(id, req.user.id, req.user.role, req.user.organizationId);
    }
    pickup(req, id) {
        return this.deliveryService.pickupByDeliveryId(id, req.user.id, req.user.organizationId);
    }
    async confirmDelivery(req, id, file) {
        if (!file) {
            throw new common_1.BadRequestException('Delivery confirmation file upload is required');
        }
        this.fileUploadService.validateFile(file);
        const subPath = path.join(req.user.organizationId, id, 'delivery');
        const confirmationPath = await this.fileUploadService.store(file, subPath, 'DELIVERY_CONFIRMATION');
        return this.deliveryService.confirmDeliveryById(id, req.user.id, req.user.organizationId, confirmationPath);
    }
    async confirmDeliveryNote(req, id, body) {
        const confirmationPath = `note:${body.note?.trim() || 'Confirmed by driver'} — ${new Date().toISOString()}`;
        return this.deliveryService.confirmDeliveryById(id, req.user.id, req.user.organizationId, confirmationPath);
    }
};
exports.DeliveriesController = DeliveriesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.MANAGER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.MANAGER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/pickup'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "pickup", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "confirmDelivery", null);
__decorate([
    (0, common_1.Post)(':id/confirm-note'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.OWNER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "confirmDeliveryNote", null);
exports.DeliveriesController = DeliveriesController = __decorate([
    (0, common_1.Controller)('deliveries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService,
        file_upload_service_1.FileUploadService])
], DeliveriesController);
//# sourceMappingURL=deliveries.controller.js.map