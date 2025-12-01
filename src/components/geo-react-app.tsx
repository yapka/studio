'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import type { MapLayer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function GeoReactApp() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);
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
  
  const handleSearchResult = (result: { lat: number; lng: number; }) => {
    setCenter([result.lat, result.lng]);
    setZoom(15);
  };
  
  return (
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
  );
}
