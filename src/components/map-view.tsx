'use client';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import type { MapLayer } from '@/lib/types';
import GeoJsonLayer from './map/geojson-layer';
import LocateButton from './map/locate-button';

type MapViewProps = {
  layers: MapLayer[];
  center: { lat: number; lng: number };
  zoom: number;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onZoomChange: (zoom: number) => void;
};

export default function MapView({ layers, center, zoom, onCenterChange, onZoomChange }: MapViewProps) {
  const [mapStyle, setMapStyle] = useState<google.maps.MapTypeStyle[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch('/map-style.json')
      .then(res => res.json())
      .then(setMapStyle)
      .catch(() => console.error('Failed to load map style.'));
  }, []);

  const handleLocateSuccess = (position: GeolocationPosition) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setUserLocation(newLocation);
    onCenterChange(newLocation);
    onZoomChange(15);
  };

  return (
    <div className="h-full w-full relative">
      <Map
        center={center}
        zoom={zoom}
        onCenterChanged={ev => onCenterChange(ev.detail.center)}
        onZoomChanged={ev => onZoomChange(ev.detail.zoom)}
        mapId="georeact_map"
        styles={mapStyle}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="h-full w-full border-0"
      >
        {layers.map(layer => layer.visible && <GeoJsonLayer key={layer.id} data={layer.data} style={layer.style} />)}
        {userLocation && (
          <AdvancedMarker position={userLocation} title="Votre position">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
          </AdvancedMarker>
        )}
      </Map>
      <LocateButton onLocateSuccess={handleLocateSuccess} />
    </div>
  );
}
