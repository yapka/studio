'use client';

import { SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarSeparator } from '@/components/ui/sidebar';
import LayerManager from './layer-manager';
import DataUploader from './data-uploader';
import type { MapLayer } from '@/lib/types';
import { Globe, Layers } from 'lucide-react';
import StyleEditor from './style-editor';

type AppSidebarProps = {
  layers: MapLayer[];
  onAddLayer: (layer: Omit<MapLayer, 'id'>) => void;
  onRemoveLayer: (layerId: string) => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onUpdateLayerStyle: (
    layerId: string,
    style: Partial<MapLayer['style']>
  ) => void;
  selectedLayerId: string | null;
  onSelectedLayerIdChange: (id: string | null) => void;
};

export default function AppSidebar({
  layers,
  onAddLayer,
  onRemoveLayer,
  onToggleLayerVisibility,
  onUpdateLayerStyle,
  selectedLayerId,
  onSelectedLayerIdChange,
}: AppSidebarProps) {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 font-semibold p-2">
            <Globe className="h-6 w-6" />
            <span>GeoReact Blanc</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Couches de données
            </SidebarGroupLabel>
            <DataUploader onAddLayer={onAddLayer} />
            <LayerManager
                layers={layers}
                onRemoveLayer={onRemoveLayer}
                onToggleLayerVisibility={onToggleLayerVisibility}
                onEditStyle={onSelectedLayerIdChange}
            />
        </SidebarGroup>
      </SidebarContent>
      {selectedLayer && (
         <StyleEditor layer={selectedLayer} onUpdateStyle={onUpdateLayerStyle} onClose={() => onSelectedLayerIdChange(null)}/>
      )}
    </>
  );
}
