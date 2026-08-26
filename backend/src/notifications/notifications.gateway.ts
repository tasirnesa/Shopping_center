import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('NotificationsGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Basic connection handling. For a more robust app, we'd join users to their organisation rooms.
  }

  handleDisconnect(client: Socket) {
  }

  // Broadcaster function for internal services to call
  notifyRole(organizationId: string, role: string) {
    // Sends standard notification update flag to all clients listening
    this.server.emit('newNotification', { organizationId, role });
  }
}
