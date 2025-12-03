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

// Ce composant met à jour la carte lorsque les props (center, zoom) changent.
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

// Ce composant met à jour l'état parent lorsque l'utilisateur interagit avec la carte.
function MapEvents({ onCenterChange, onZoomChange }: Pick<MapViewProps, 'onCenterChange' | 'onZoomChange'>) {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        onCenterChange([center.lat, center.lng]);
      },
      zoomend: (e) => {
        onZoomChange(e.target.getZoom());
      },
    });
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
    onCenterChange(newLocation); // Met à jour le centre dans l'état parent
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
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
        // Ne pas passer de props qui changent ici pour éviter la réinitialisation
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Les composants internes gèrent les mises à jour */}
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

export default memo(MapView);