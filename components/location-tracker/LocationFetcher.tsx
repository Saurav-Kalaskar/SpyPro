"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { estimateFloorLevel, calibrateGroundLevel } from '../../src/utils/floorEstimation';

interface LocationFetcherProps {
    onLocationUpdate: (latitude: number, longitude: number) => void;
}

interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    estimatedFloor: number | null;
    timestamp: string;
}

const LocationFetcher: React.FC<LocationFetcherProps> = ({ onLocationUpdate }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [groundLevelSamples, setGroundLevelSamples] = useState<number[]>([]);

    const calculateFloorLevel = (altitude: number): number | null => {
        // Get the calibrated ground level
        const groundLevel = calibrateGroundLevel(groundLevelSamples);
        
        return estimateFloorLevel(altitude, {
            groundLevelAltitude: groundLevel,
            averageFloorHeight: 3, // Configurable based on region/building
            maxFloors: 200
        });
    };

    const handleGroundCalibration = (altitude: number) => {
        setGroundLevelSamples(prev => [...prev, altitude].slice(-5)); // Keep last 5 samples
    };

    const saveLocation = async (locationData: LocationData) => {
        try {
            await axios.post('/api/locations', locationData);
            setLoading(false);
        } catch (err) {
            setError('Failed to save location');
            setLoading(false);
        }
    };

    const fetchLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { 
                        latitude, 
                        longitude, 
                        altitude, 
                        accuracy, 
                        altitudeAccuracy 
                    } = position.coords;

                    if (altitude) {
                        handleGroundCalibration(altitude);
                    }

                    const estimatedFloor = altitude ? 
                        calculateFloorLevel(altitude) : null;

                    const locationData: LocationData = {
                        latitude,
                        longitude,
                        altitude: altitude || null,
                        accuracy,
                        altitudeAccuracy: altitudeAccuracy || null,
                        estimatedFloor,
                        timestamp: new Date().toISOString()
                    };

                    onLocationUpdate(latitude, longitude);

                    await saveLocation(locationData);
                },
                (err) => {
                    setError('Unable to retrieve your location');
                    setLoading(false);
                },
                { 
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
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