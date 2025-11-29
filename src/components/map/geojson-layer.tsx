'use client';
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import type { FeatureCollection } from 'geojson';

type GeoJsonLayerProps = {
  data: FeatureCollection;
  style: google.maps.Data.StyleOptions;
};

export default function GeoJsonLayer({ data, style }: GeoJsonLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    const layer = new google.maps.Data({map: map});
    layer.addGeoJson(data);
    layer.setStyle(style);

    return () => {
      // Clean up: remove all features from the data layer
      layer.forEach(feature => {
        layer.remove(feature);
      });
      // Detach the layer from the map
      layer.setMap(null);
    };

  }, [map, data, style]);

  return null;
}
