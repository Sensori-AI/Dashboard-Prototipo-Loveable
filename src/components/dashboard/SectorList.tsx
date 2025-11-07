import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Sector {
  id: string;
  name: string;
  area: number;
  infestationLevel: "high" | "medium" | "low";
  percentage: number;
  coordinates: { lat: number; lng: number };
}

interface SectorListProps {
  sectors: Sector[];
  onSectorClick: (sector: Sector) => void;
  selectedSectorId?: string;
  type: "weeds" | "failures" | "vigor";
}

export const SectorList = ({
  sectors,
  onSectorClick,
  selectedSectorId,
  type,
}: SectorListProps) => {
  const getTitle = () => {
    switch (type) {
      case "weeds":
        return "Setores com Infestação";
      case "failures":
        return "Setores com Falhas";
      case "vigor":
        return "Setores Analisados";
      default:
        return "Setores";
    }
  };

  const getInfestationColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getInfestationText = (level: string) => {
    switch (level) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return level;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{getTitle()}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {sectors.length} setores identificados
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-2 px-6 pb-4">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => onSectorClick(sector)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all hover:shadow-md hover:scale-[1.02]",
                  selectedSectorId === sector.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-semibold text-sm text-foreground">
                        {sector.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{sector.area.toFixed(2)} ha</span>
                      <span>•</span>
                      <span>{sector.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={getInfestationColor(sector.infestationLevel) as any} className="text-xs">
                      {getInfestationText(sector.infestationLevel)}
                    </Badge>
                    <ZoomIn className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
