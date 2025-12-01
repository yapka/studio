'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { MapLayer } from '@/lib/types';
import { Plus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

type GeoserverLayerAdderProps = {
  onAddLayer: (layer: Omit<MapLayer, 'id'>) => void;
};

export default function GeoserverLayerAdder({ onAddLayer }: GeoserverLayerAdderProps) {
  const [geoserverUrl, setGeoserverUrl] = useState('http://localhost:8080/geoserver');
  const [workspace, setWorkspace] = useState('cite');
  const [layerName, setLayerName] = useState('batiments');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddLayer = async () => {
    if (!geoserverUrl || !workspace || !layerName) {
      toast({
        variant: 'destructive',
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs pour ajouter une couche.',
      });
      return;
    }
    setIsLoading(true);

    const wfsUrl = `${geoserverUrl}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json`;

    try {
      const response = await fetch(wfsUrl);
      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.type !== 'FeatureCollection' || !data.features) {
        throw new Error('La réponse de GeoServer n\'est pas un GeoJSON valide (FeatureCollection).');
      }

      onAddLayer({
        name: layerName,
        data,
        visible: true,
        style: {
          fillColor: '#4A90E2',
          color: '#3B82F6',
          weight: 1,
          fillOpacity: 0.7,
        },
      });

      toast({
        title: 'Succès',
        description: `La couche "${layerName}" a été ajoutée avec succès.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Échec de l\'ajout de la couche',
        description: error instanceof Error ? error.message : 'Impossible de récupérer les données depuis GeoServer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2">
    <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter une couche GeoServer</span>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card className="border-0 shadow-none">
                    <CardHeader className="p-2 pt-0">
                        <CardTitle className="text-base">Paramètres GeoServer</CardTitle>
                        <CardDescription className="text-xs">
                        Ajoutez une couche depuis un service WFS GeoServer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-2">
                        <div className="space-y-2">
                        <Label htmlFor="geoserver-url">URL GeoServer</Label>
                        <Input id="geoserver-url" value={geoserverUrl} onChange={e => setGeoserverUrl(e.target.value)} placeholder="http://localhost:8080/geoserver" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="workspace">Espace de travail (Workspace)</Label>
                        <Input id="workspace" value={workspace} onChange={e => setWorkspace(e.target.value)} placeholder="ex: cite" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="layer-name">Nom de la couche</Label>
                        <Input id="layer-name" value={layerName} onChange={e => setLayerName(e.target.value)} placeholder="ex: batiments" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button onClick={handleAddLayer} disabled={isLoading} className="w-full">
                            {isLoading ? 'Chargement...' : 'Ajouter la couche'}
                        </Button>
                    </CardFooter>
                </Card>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    </div>
  );
}
