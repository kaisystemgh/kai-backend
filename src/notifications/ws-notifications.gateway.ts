import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsNotificationsService } from './ws-notifications.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
export class NotificationsWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private RESERVA_UPDATED_EVENT = 'reserva-updated';
  @WebSocketServer() wss: Server;

  constructor(private readonly service: WsNotificationsService) {}
  handleConnection(client: Socket) {
    this.service.registerClient(client);
    console.log('clients online: ', this.service.getConnectedClients());
  }
  handleDisconnect(client: Socket) {
    this.service.removeClient(client.id);
    console.log('clients online: ', this.service.getConnectedClients());
  }

  @SubscribeMessage('get-reservas')
  private handleGetReservas(client: Socket, dateString: string) {
    return this.service.handleGetReservas(client, dateString);
  }

  @SubscribeMessage('reserva-updated')
  private handleReservaUpdated(client: Socket, payload: any) {
    console.log('db emitió mensaje');
    this.wss.emit('reserva-updated', JSON.parse(payload));
    console.log('evento reenviado');
  }

  @SubscribeMessage('try-to-update-reserva')
  private handleSendMessage(client: Socket, payload: any) {
    console.log('web emitió mensaje', payload);
    this.wss.emit('try-to-update-reserva', payload);
    console.log('evento reenviado');
  }
}
