'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface GeocoderProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function Geocoder({ onPlaceSelect }: GeocoderProps) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const ac = new places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
    });

    setAutocomplete(ac);
    return () => {
        google.maps.event.clearInstanceListeners(ac);
    }
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;

    const listener = autocomplete.addListener('place_changed', () => {
      onPlaceSelect(autocomplete.getPlace());
    });

    return () => {
      google.maps.event.removeListener(listener);
    }
  }, [autocomplete, onPlaceSelect]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Rechercher un lieu..."
        className="w-full pl-9"
      />
    </div>
  );
}
