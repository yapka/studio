'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Globe } from 'lucide-react';
import Geocoder from './map/geocoder';

type AppHeaderProps = {
  onSearchResult: (place: google.maps.places.PlaceResult) => void;
};

export default function AppHeader({ onSearchResult }: AppHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Globe className="h-6 w-6 text-primary" />
        <span className="">GeoReact Blanc</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Geocoder onPlaceSelect={onSearchResult} />
        <SidebarTrigger className="md:hidden" />
      </div>
    </header>
  );
}
