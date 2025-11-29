'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Trash2, Palette } from 'lucide-react';
import type { MapLayer } from '@/lib/types';

type LayerManagerProps = {
  layers: MapLayer[];
  onRemoveLayer: (layerId: string) => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onEditStyle: (layerId: string) => void;
};

export default function LayerManager({
  layers,
  onRemoveLayer,
  onToggleLayerVisibility,
  onEditStyle,
}: LayerManagerProps) {
  if (layers.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No data layers loaded.
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-2">
        {layers.map(layer => (
          <Card key={layer.id} className="group transition-colors hover:bg-secondary/50">
            <CardContent className="p-2 flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: layer.style.fillColor }}
              />
              <span className="flex-1 text-sm truncate" title={layer.name}>
                {layer.name}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEditStyle(layer.id)}
                  aria-label="Edit style"
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToggleLayerVisibility(layer.id)}
                  aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/80 hover:text-destructive"
                  onClick={() => onRemoveLayer(layer.id)}
                  aria-label="Remove layer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
