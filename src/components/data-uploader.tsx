'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MapLayer } from '@/lib/types';

type DataUploaderProps = {
  onAddLayer: (layer: Omit<MapLayer, 'id'>) => void;
};

export default function DataUploader({ onAddLayer }: DataUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('Failed to read file.');
        
        const data = JSON.parse(text);
        
        if (data.type !== 'FeatureCollection') {
            throw new Error('Invalid GeoJSON: Must be a FeatureCollection.');
        }

        onAddLayer({
          name: file.name,
          data,
          visible: true,
          style: {
            fillColor: '#4A90E2',
            strokeColor: '#3B82F6',
            strokeWeight: 1,
          },
        });
        toast({
          title: "Success",
          description: `Layer "${file.name}" added successfully.`,
        });

      } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error instanceof Error ? error.message : "Could not parse GeoJSON file.",
        });
      } finally {
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json, .geojson"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload GeoJSON
      </Button>
    </div>
  );
}
