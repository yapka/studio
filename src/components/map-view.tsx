'use client';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import type { MapLayer } from '@/lib/types';
import LocateButton from './map/locate-button';
import { useState, memo, useEffect } from 'react';
import L from 'leaflet';

type MapViewProps = {
  layers: MapLayer[];
  center: [number, number];
  zoom: number;
  onCenterChange: (center: [number, number]) => void;
  onZoomChange: (zoom: number) => void;
};

// Component to handle map events
function MapEvents({ onCenterChange, onZoomChange }: Pick<MapViewProps, 'onCenterChange' | 'onZoomChange'>) {
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        onCenterChange([center.lat, center.lng]);
      },
      zoomend: () => {
        onZoomChange(map.getZoom());
      },
    });
    return null;
}

// Component to sync map view state
function MapViewUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    
    useEffect(() => {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        if (currentCenter.lat !== center[0] || currentCenter.lng !== center[1] || currentZoom !== zoom) {
             map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
}

function MapView({ layers, center, zoom, onCenterChange, onZoomChange }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocateSuccess = (position: GeolocationPosition) => {
    const newLocation: [number, number] = [
      position.coords.latitude,
      position.coords.longitude,
    ];
    setUserLocation(newLocation);
    onCenterChange(newLocation);
    onZoomChange(15);
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
      const popupContent = Object.entries(feature.properties)
        .map(([key, value]) => `<b>${key}:</b> ${value}`)
        .join('<br/>');
      layer.bindPopup(popupContent);
    }
  };

  const userMarkerIcon = L.divIcon({
    html: '<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className="h-full w-full relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewUpdater center={center} zoom={zoom} />
        <MapEvents onCenterChange={onCenterChange} onZoomChange={onZoomChange} />
        
        {layers.map(layer =>
          layer.visible && (
            <GeoJSON 
              key={layer.id} 
              data={layer.data} 
              style={() => layer.style}
              onEachFeature={onEachFeature}
            />
          )
        )}
        {userLocation && (
          <Marker position={userLocation} icon={userMarkerIcon}>
            <Popup>Votre position</Popup>
          </Marker>
        )}
      </MapContainer>
      <LocateButton onLocateSuccess={handleLocateSuccess} />
    </div>
  );
}

// Using React.memo to prevent unnecessary re-renders
export default memo(MapView);
