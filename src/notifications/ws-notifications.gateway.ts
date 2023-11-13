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
  }
  handleDisconnect(client: Socket) {
    this.service.removeClient(client.id);
  }

  @SubscribeMessage('get-reservas')
  private handleGetReservas(client: Socket, dateString: string) {
    return this.service.handleGetReservas(client, dateString);
  }

  @SubscribeMessage('get-reserva')
  private handleGetReserva(client: Socket, id: string) {
    return this.service.handleGetReserva(client, id);
  }

  @SubscribeMessage('get-recursos-disponibles')
  private handleGetRecursosDisponibles(client: Socket, payload: string[]) {
    return this.service.handleGetRecursosDisponibles(client, payload);
  }

  @SubscribeMessage('save-reserva')
  private handleSaveReserva(client: Socket, payload) {
    return this.service.handleSaveReserva(client, payload);
  }

  @SubscribeMessage('update-reserva')
  private handleUpdateReserva(client: Socket, payload) {
    return this.service.handleUpdateReserva(client, payload);
  }

  @SubscribeMessage('delete-reserva')
  private handleDeleteReserva(client: Socket, payload) {
    return this.service.handleDeleteReserva(client, payload);
  }

  @SubscribeMessage('reserva-updated')
  private handleReservaUpdated(client: Socket, payload: any) {
    this.wss.emit('reserva-updated', JSON.parse(payload));
  }
}
