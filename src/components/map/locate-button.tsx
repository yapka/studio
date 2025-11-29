'use client';

import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LocateButtonProps = {
  onLocateSuccess: (position: GeolocationPosition) => void;
};

export default function LocateButton({ onLocateSuccess }: LocateButtonProps) {
  const { toast } = useToast();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onLocateSuccess,
      () => {
        toast({
            variant: "destructive",
            title: "Geolocation Error",
            description: "Unable to retrieve your location. Please check your browser permissions.",
        });
      }
    );
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button variant="secondary" size="icon" onClick={handleLocate} aria-label="Find my location">
        <Crosshair className="h-5 w-5" />
      </Button>
    </div>
  );
}
