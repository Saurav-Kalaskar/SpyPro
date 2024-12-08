// components/location-tracker/Map.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationData {
  userId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  estimatedFloor?: number;
  accuracy?: number;
  timestamp: string;
}

interface MapProps {
  locations: LocationData[];
}

const Map = ({ locations }: MapProps) => {
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is required');
      return;
    }

    const latestLocation = locations[locations.length - 1];
    if (!latestLocation) return;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [latestLocation.longitude, latestLocation.latitude],
      zoom: 18,
      pitch: 60,
      bearing: -60,
      antialias: true
    });

    map.on('load', () => {
      // Add 3D buildings layer
      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add markers for all locations
      locations.forEach((location, index) => {
        const isLatest = index === locations.length - 1;
        
        new mapboxgl.Marker({
          color: isLatest ? '#FF0000' : '#666666',
          scale: isLatest ? 0.8 : 0.6
        })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <p><strong>${isLatest ? 'Current Location' : 'Previous Location'}</strong></p>
              <p>Time: ${new Date(location.timestamp).toLocaleString()}</p>
              ${location.altitude ? `<p>Altitude: ${Math.round(location.altitude)}m</p>` : ''}
              ${location.estimatedFloor ? `<p>Floor: ${location.estimatedFloor}</p>` : ''}
              ${location.accuracy ? `<p>Accuracy: ±${Math.round(location.accuracy)}m</p>` : ''}
            </div>
          `)
        )
        .addTo(map);
      });
    });

    return () => map.remove();
  }, [locations]);

  return <div id="map" className="w-full h-[600px]" />;
};

export default Map;