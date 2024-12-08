'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../auth/AuthProvider';
import Map from './Map';

interface LocationData {
  userId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  estimatedFloor?: number;
  accuracy?: number;
  timestamp: string;
}

interface SocketConnectionError extends Error {
  message: string;
  description?: string;
}

const MAX_LOCATIONS = 50; // Limit stored locations

export default function RealTimeTracker() {
  const { isAuthenticated, user } = useAuth();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000', {
      path: '/api/socket',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      setError(null);
      socket.emit('join', { userId: user.id });
    });

    socket.on('location-update', (data: LocationData) => {
      if (data.userId === user.id) {
        setLocations(prev => [...prev.slice(-MAX_LOCATIONS + 1), data]);
      }
    });

    socket.on('connect_error', (error: SocketConnectionError) => {
      setError('Failed to connect to tracking server');
      setIsConnected(false);
      console.error('Socket connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber: number) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    setIsLoading(false);

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <div className="text-center p-4">Please log in to view tracking data.</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading tracking data...</div>;
  }

  return (
    <div className="w-full h-full">
      {error && (
        <div className="text-red-500 text-center p-4 mb-4">{error}</div>
      )}
      <div className="mb-4 text-sm text-gray-600">
        Status: {isConnected ? 
          <span className="text-green-500">Connected</span> : 
          <span className="text-red-500">Disconnected</span>
        }
      </div>
      <Map locations={locations} />
    </div>
  );
}