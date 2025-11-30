'use client';
import { SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import type { MapLayer } from '@/lib/types';

type StyleEditorProps = {
  layer: MapLayer;
  onUpdateStyle: (layerId: string, style: Partial<MapLayer['style']>) => void;
  onClose: () => void;
};

export default function StyleEditor({ layer, onUpdateStyle, onClose }: StyleEditorProps) {
  const handleStyleChange = (key: keyof MapLayer['style'], value: string | number) => {
    onUpdateStyle(layer.id, { [key]: value });
  };
  
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
                value={layer.style.fillColor}
                onChange={e => handleStyleChange('fillColor', e.target.value)}
                />
                <Input 
                    type="text"
                    value={layer.style.fillColor}
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
                value={layer.style.strokeColor}
                onChange={e => handleStyleChange('strokeColor', e.target.value)}
                />
                <Input 
                    type="text"
                    value={layer.style.strokeColor}
                    onChange={e => handleStyleChange('strokeColor', e.target.value)}
                    className="h-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="strokeWeight">Épaisseur du contour: {layer.style.strokeWeight}px</Label>
            <Slider
              id="strokeWeight"
              min={0}
              max={10}
              step={0.5}
              value={[layer.style.strokeWeight]}
              onValueChange={([value]) => handleStyleChange('strokeWeight', value)}
            />
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
