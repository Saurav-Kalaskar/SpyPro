import { useState } from 'react';
import { Suspense } from 'react';
import Map from '../../../components/location-tracker/Map';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import LocationFetcher from '../../../components/location-tracker/LocationFetcher';

export default function DashboardPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationUpdate = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">SpyPro Dashboard</h1>
      <LocationFetcher onLocationUpdate={handleLocationUpdate} /> {/* Pass the handler */}
      <Suspense fallback={<LoadingSpinner />}>
        {location ? (
          <Map latitude={location.latitude} longitude={location.longitude} />
        ) : (
          <p>Please fetch your location.</p>
        )}
      </Suspense>
    </main>
  );
}