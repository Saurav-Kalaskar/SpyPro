// pages/api/socket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import { initSocket } from '../../lib/socket';

interface ServerWithIO extends HTTPServer {
  io?: any;
}

interface SocketWithIO extends Socket {
  server: ServerWithIO;
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO | null;
}

const socketHandler = (req: NextApiRequest, res: ResponseWithSocket) => {
  if (!res.socket?.server) {
    res.status(500).json({ error: 'Socket server not initialized' });
    return;
  }

  if (!res.socket.server.io) {
    const httpServer = res.socket.server;
    res.socket.server.io = initSocket(httpServer);
    console.log('Socket.io initialized');
  }

  res.end();
}

export default socketHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};