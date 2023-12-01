import { Socket } from 'socket.io';

export interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user_id: string;
    client_id: string;
    kai_client_id: string;
  };
}
