import type { FeatureCollection } from 'geojson';
import type { PathOptions } from 'leaflet';

export interface MapLayer {
  id: string;
  name: string;
  data: FeatureCollection;
  visible: boolean;
  style: PathOptions;
}
