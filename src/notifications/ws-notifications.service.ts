import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './dtos/sockets.dto';
import * as admin from 'firebase-admin';
@Injectable()
export class WsNotificationsService {
  private connectedClients: ConnectedClients = {};

  constructor() {}

  async registerClient(client: Socket) {
    const user_id = client.handshake.headers.user_id;
    const token = client.handshake.headers.token;
    if (await this.canConnectUser(user_id?.toString(), token?.toString()))
      this.connectedClients[client.id] = { socket: client, user_id: String(user_id) };
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

  private async canConnectUser(user_id: string, token: string) {
    if (Object.values(this.connectedClients).some((x) => x.user_id === user_id)) return false;
    if (user_id === 'KAI_DESKTOP') return true;
    try {
      await admin.auth().verifyIdToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  private getKAIDesktopClient(): Socket {
    const kai = Object.values(this.connectedClients).find((x) => x.user_id === 'KAI_DESKTOP');
    return kai ? kai.socket : null;
  }
}
