import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps{
    latitude: number;
    longitude: number;
}

export default function Map ({ latitude, longitude}: MapProps){
    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
        if (!mapboxgl.accessToken){
            console.error('Mapbox access token is required');
            return;
        }

        const map = new mapboxgl.Map({
            container: 'mao',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom:15,
        });

        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

        return () => map.remove();
    }, [latitude, longitude]);

    return <div id="map" className="w-full h-96"></div>
}