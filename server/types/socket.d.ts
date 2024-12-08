import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface ServerToClientEvents {
    'location-update': (data: {
      userId: string;
      latitude: number;
      longitude: number;
      altitude?: number;
      estimatedFloor?: number;
      accuracy?: number;
      timestamp: string;
    }) => void;
  }

  interface ClientToServerEvents {
    join: (data: { userId: string }) => void;
    'location-update': (data: {
      userId: string;
      latitude: number;
      longitude: number;
      altitude?: number;
      estimatedFloor?: number;
      accuracy?: number;
    }) => void;
  }

  interface InterServerEvents {
    ping: () => void;
  }
}