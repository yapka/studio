'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GeocoderProps {
  onPlaceSelect: (result: { lat: number; lng: number; }) => void;
}

type NominatimResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

export default function Geocoder({ onPlaceSelect }: GeocoderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json`
    );
    const data: NominatimResult[] = await response.json();
    setResults(data);
    if(data.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (result: NominatimResult) => {
    onPlaceSelect({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setQuery(result.display_name);
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <form onSubmit={handleSearch}>
            <Input
                type="text"
                placeholder="Rechercher un lieu..."
                className="w-full pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
        {results.length > 0 && (
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button className="hidden"></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[384px]">
                    {results.map((result) => (
                    <DropdownMenuItem
                        key={result.place_id}
                        onSelect={() => handleSelect(result)}
                    >
                        {result.display_name}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )}
    </div>
  );
}
