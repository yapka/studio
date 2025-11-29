import type { FeatureCollection } from 'geojson';

export interface MapLayer {
  id: string;
  name: string;
  data: FeatureCollection;
  visible: boolean;
  style: {
    fillColor: string;
    strokeColor: string;
    strokeWeight: number;
  };
}
