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
        title: "Erreur de géolocalisation",
        description: "La géolocalisation n'est pas supportée par votre navigateur.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onLocateSuccess,
      () => {
        toast({
            variant: "destructive",
            title: "Erreur de géolocalisation",
            description: "Impossible de récupérer votre position. Veuillez vérifier les autorisations de votre navigateur.",
        });
      }
    );
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button variant="secondary" size="icon" onClick={handleLocate} aria-label="Trouver ma position">
        <Crosshair className="h-5 w-5" />
      </Button>
    </div>
  );
}
