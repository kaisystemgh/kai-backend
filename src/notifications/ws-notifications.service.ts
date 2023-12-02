import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './dtos/sockets.dto';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class WsNotificationsService {
  private JWT_SECRET: string;
  private connectedClients: ConnectedClients = {};

  constructor(private readonly configService: ConfigService) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
  }

  async registerClient(client: Socket) {
    const token = String(client.handshake.headers.token) ?? String(client.handshake.headers.authorization);
    const kai_client_id = client.handshake.headers.kai_client_id;
    try {
      if (kai_client_id) {
        client.on('disconnect', () => {
          console.log('Escritorio disconnect');
        });
        client.on('close', () => {
          console.log('Escritorio close');
        });
        this.connectedClients[client.id] = {
          socket: client,
          user_id: null,
          client_id: null,
          kai_client_id: String(kai_client_id),
        };
      } else {
        const user = verify(token, this.JWT_SECRET);
        const user_id = user['user_id'];
        const client_id = user['client_id'];

        this.connectedClients[client.id] = { socket: client, user_id, client_id, kai_client_id: null };
        client.join(client_id);
      }
    } catch (e) {
      client.disconnect();
    }
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients).length;
  }

  async handleGetReservas(client: Socket, date: string) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-reservas', date);
  }

  async handleGetReserva(client: Socket, id: string) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-reserva', id);
  }

  async handleGetRecursosDisponibles(client: Socket, payload: string[]) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('get-recursos-disponibles', payload);
  }

  async handleSaveReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('save-reserva', [payload, client.handshake.headers.user_id]);
  }

  async handleUpdateReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('update-reserva', [payload, client.handshake.headers.user_id]);
  }

  async handleDeleteReserva(client: Socket, payload: any) {
    const kai = this.getKAIDesktopClient(client);
    if (!kai) return 'KAI not found';
    return kai.emitWithAck('delete-reserva', [payload, client.handshake.headers.user_id]);
  }

  private getKAIDesktopClient(client: Socket): Socket | null {
    const { client_id } = this.connectedClients[client.id];
    const kai = Object.values(this.connectedClients).find((x) => {
      return x.kai_client_id === String(client_id);
    });
    return kai ? kai.socket : null;
  }
}
