'use client';

import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../auth/AuthProvider';
import Map from './Map';

interface LocationData {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

let socket: typeof Socket;

export default function RealTimeTracker() {
  const { isAuthenticated, user } = useAuth();
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      socket = io('/api/socket');

      socket.emit('join', { userId: user.id });

      socket.on('location-update', (data: LocationData) => {
        setLocations((prev) => [...prev, data]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <div>Please log in to view real-time tracking.</div>;
  }

  const latestLocation = locations[locations.length - 1];

  return (
    <div>
      {latestLocation ? (
        <Map latitude={latestLocation.latitude} longitude={latestLocation.longitude} />
      ) : (
        <div>No location data available.</div>
      )}
    </div>
  );
}