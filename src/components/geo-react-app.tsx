'use client';

import React, { useState, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import MapView from '@/components/map-view';
import type { MapLayer } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GeoReactApp() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 });
  const [zoom, setZoom] = useState(5);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const addLayer = (newLayer: Omit<MapLayer, 'id'>) => {
    setLayers(prevLayers => [
      ...prevLayers,
      { ...newLayer, id: `layer-${Date.now()}` },
    ]);
  };

  const removeLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const updateLayerStyle = (
    layerId: string,
    style: Partial<MapLayer['style']>
  ) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId
          ? { ...layer, style: { ...layer.style, ...style } }
          : layer
      )
    );
  };
  
  const handleSearchResult = useCallback((place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
        setCenter(place.geometry.location.toJSON());
        setZoom(15);
    }
  }, []);
  
  if (!API_KEY) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="rounded-lg border bg-card p-6 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
          <p className="mt-2 text-muted-foreground">
            Google Maps API key is missing.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Please set the <code className="rounded bg-muted px-1 font-mono text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col">
          <AppHeader onSearchResult={handleSearchResult} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar>
              <AppSidebar
                layers={layers}
                onAddLayer={addLayer}
                onRemoveLayer={removeLayer}
                onToggleLayerVisibility={toggleLayerVisibility}
                onUpdateLayerStyle={updateLayerStyle}
                selectedLayerId={selectedLayerId}
                onSelectedLayerIdChange={setSelectedLayerId}
              />
            </Sidebar>
            <SidebarInset>
              <MapView 
                layers={layers} 
                center={center}
                zoom={zoom}
                onCenterChange={setCenter}
                onZoomChange={setZoom}
              />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </APIProvider>
  );
}
