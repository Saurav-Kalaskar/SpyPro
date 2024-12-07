import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  estimatedFloor?: number;
  accuracy?: number;
}

interface MapProps {
  locationData: LocationData;
}

const Map = ({ locationData }: MapProps) => {
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is required');
      return;
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [locationData.longitude, locationData.latitude],
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

      // Add marker with altitude info
      if (locationData.altitude) {
        new mapboxgl.Marker({
          color: '#FF0000',
          scale: 0.8
        })
        .setLngLat([locationData.longitude, locationData.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div>
              <p>Altitude: ${Math.round(locationData.altitude)}m</p>
              <p>Floor: ${locationData.estimatedFloor || 'Unknown'}</p>
              <p>Accuracy: ${locationData.accuracy ? `±${Math.round(locationData.accuracy)}m` : 'Unknown'}</p>
            </div>
          `)
        )
        .addTo(map);
      }
    });

    return () => map.remove();
  }, [locationData]);

  return <div id="map" className="w-full h-[600px]" />;
};

export default Map;