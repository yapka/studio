'use client';
import { SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import type { MapLayer } from '@/lib/types';
import type { PathOptions } from 'leaflet';

type StyleEditorProps = {
  layer: MapLayer;
  onUpdateStyle: (layerId: string, style: Partial<MapLayer['style']>) => void;
  onClose: () => void;
};

export default function StyleEditor({ layer, onUpdateStyle, onClose }: StyleEditorProps) {
  const handleStyleChange = (key: keyof PathOptions, value: string | number) => {
    onUpdateStyle(layer.id, { [key]: value });
  };
  
  const fillColor = layer.style.fillColor || '#4A90E2';
  const color = layer.style.color || '#3B82F6';
  const weight = layer.style.weight || 1;

  return (
    <>
      <SidebarSeparator />
      <SidebarFooter className="p-4 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold">Éditeur de style</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <p className="text-sm text-muted-foreground truncate" title={layer.name}>
            Édition: <span className="font-medium text-foreground">{layer.name}</span>
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fillColor">Couleur de remplissage</Label>
            <div className="flex items-center gap-2">
                <Input
                id="fillColor"
                type="color"
                className="w-12 h-10 p-1"
                value={fillColor}
                onChange={e => handleStyleChange('fillColor', e.target.value)}
                />
                <Input 
                    type="text"
                    value={fillColor}
                    onChange={e => handleStyleChange('fillColor', e.target.value)}
                    className="h-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="strokeColor">Couleur du contour</Label>
            <div className="flex items-center gap-2">
                <Input
                id="strokeColor"
                type="color"
                className="w-12 h-10 p-1"
                value={color}
                onChange={e => handleStyleChange('color', e.target.value)}
                />
                <Input 
                    type="text"
                    value={color}
                    onChange={e => handleStyleChange('color', e.target.value)}
                    className="h-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="strokeWeight">Épaisseur du contour: {weight}px</Label>
            <Slider
              id="strokeWeight"
              min={0}
              max={10}
              step={0.5}
              value={[weight]}
              onValueChange={([value]) => handleStyleChange('weight', value)}
            />
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
