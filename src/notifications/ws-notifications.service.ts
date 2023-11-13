import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './dtos/sockets.dto';
@Injectable()
export class WsNotificationsService {
  private connectedClients: ConnectedClients = {};

  constructor() {}

  registerClient(client: Socket) {
    const user_id = client.handshake.headers.user_id;
    if (this.canConnectUser(user_id)) this.connectedClients[client.id] = { socket: client, user_id: String(user_id) };
    else client.disconnect();
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients).length;
  }

  async handleGetReservas(client: Socket, date: string) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-reservas', date);
  }

  async handleGetReserva(client: Socket, id: string) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-reserva', id);
  }

  async handleGetRecursosDisponibles(client: Socket, payload: string[]) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-recursos-disponibles', payload);
  }

  async handleSaveReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('save-reserva', [payload, client.handshake.headers.user_id]);
  }

  async handleUpdateReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('update-reserva', [payload, client.handshake.headers.user_id]);
  }

  async handleDeleteReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient();
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('delete-reserva', [payload, client.handshake.headers.user_id]);
  }

  private canConnectUser(user_id) {
    return !Object.values(this.connectedClients).some((x) => x.user_id === user_id);
  }

  private getKAIDesktopClient(): Socket {
    const kai = Object.values(this.connectedClients).find((x) => x.user_id === 'KAI_DESKTOP');
    return kai ? kai.socket : null;
  }
}
