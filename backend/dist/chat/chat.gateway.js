"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ChatGateway = class ChatGateway {
    jwtService;
    configService;
    server;
    userSockets = new Map();
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleConnection(client) {
        try {
            const authHeader = client.handshake.headers.authorization;
            let token = authHeader && authHeader.split(' ')[1];
            if (!token && client.handshake.query.token) {
                token = client.handshake.query.token;
            }
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET') || 'secretKey',
            });
            const userId = payload.sub;
            const existingSockets = this.userSockets.get(userId) || [];
            this.userSockets.set(userId, [...existingSockets, client.id]);
            client.join(`user_${userId}`);
        }
        catch (e) {
            console.error('Socket authentication failed:', e.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            const updatedSockets = sockets.filter((id) => id !== client.id);
            if (updatedSockets.length === 0) {
                this.userSockets.delete(userId);
            }
            else {
                this.userSockets.set(userId, updatedSockets);
            }
        }
    }
    sendToUser(userId, event, payload) {
        this.server.to(`user_${userId}`).emit(event, payload);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map