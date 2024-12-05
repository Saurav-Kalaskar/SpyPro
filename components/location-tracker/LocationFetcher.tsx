import React, { useState } from 'react';
import axios from 'axios';

interface LocationFetcherProps {
    onLocationUpdate: (latitude: number, longitude: number) => void;
}

const LocationFetcher: React.FC<LocationFetcherProps> = ({ onLocationUpdate }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                    onLocationUpdate(latitude, longitude);

                    try {
                        await axios.post('/api/locations', {
                            latitude,
                            longitude,
                        });
                        setLoading(false);
                    } catch (err) {
                        setError('Failed to save location');
                        setLoading(false);
                    }
                },
                (err) => {
                    setError('Unable to retrieve your location');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={fetchLocation} disabled={loading}>
                {loading ? 'Fetching Location...' : 'Get My Location'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LocationFetcher;