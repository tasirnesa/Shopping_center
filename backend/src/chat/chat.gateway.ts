import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // mapping userId to socket id(s)
    private userSockets = new Map<string, string[]>();

    constructor(private jwtService: JwtService, private configService: ConfigService) { }

    async handleConnection(client: Socket) {
        try {
            // Standardize token extraction: from auth header or query param
            const authHeader = client.handshake.headers.authorization;
            let token = authHeader && authHeader.split(' ')[1];
            if (!token && client.handshake.query.token) {
                token = client.handshake.query.token as string;
            }

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET') || 'secretKey',
            });
            // The payload matches what we extract in the JWT Auth strategy (payload.sub is user id)
            const userId = payload.sub;

            const existingSockets = this.userSockets.get(userId) || [];
            this.userSockets.set(userId, [...existingSockets, client.id]);

            // Add to a generic user room to broadcast to all of this user's devices easily
            client.join(`user_${userId}`);
        } catch (e) {
            console.error('Socket authentication failed:', e.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Remove the socket from tracking maps
        for (const [userId, sockets] of this.userSockets.entries()) {
            const updatedSockets = sockets.filter((id) => id !== client.id);
            if (updatedSockets.length === 0) {
                this.userSockets.delete(userId);
            } else {
                this.userSockets.set(userId, updatedSockets);
            }
        }
    }

    sendToUser(userId: string, event: string, payload: any) {
        this.server.to(`user_${userId}`).emit(event, payload);
    }
}
