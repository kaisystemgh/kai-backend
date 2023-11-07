import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './dtos/sockets.dto';
@Injectable()
export class WsNotificationsService {
  private connectedClients: ConnectedClients = {};

  constructor() {}

  registerClient(client: Socket) {
    const user_id = client.handshake.headers.user_id;
    console.log('connecting', user_id);
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
    return kai.emitWithAck('get-reservas', date);
  }

  private canConnectUser(user_id) {
    return !Object.values(this.connectedClients).some((x) => x.user_id === user_id);
  }

  private getKAIDesktopClient(): Socket {
    return Object.values(this.connectedClients).find((x) => x.user_id === 'KAI_DESKTOP').socket;
  }
}
