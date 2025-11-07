import { Card } from "@/components/ui/card";

interface Coordinate {
  lat: number;
  lng: number;
}

interface Polygon {
  id: string;
  coordinates: Coordinate[];
  type: "weed" | "failure";
  severity: "low" | "medium" | "high";
}

interface GeographicMapProps {
  polygons: Polygon[];
  selectedSectorId?: string;
  center: Coordinate;
}

export const GeographicMap = ({ polygons, selectedSectorId, center }: GeographicMapProps) => {
  // Converter coordenadas geográficas para coordenadas SVG
  const latRange = { min: center.lat - 0.01, max: center.lat + 0.01 };
  const lngRange = { min: center.lng - 0.01, max: center.lng + 0.01 };
  
  const toSVGCoords = (lat: number, lng: number) => {
    const x = ((lng - lngRange.min) / (lngRange.max - lngRange.min)) * 800;
    const y = ((latRange.max - lat) / (latRange.max - latRange.min)) * 600;
    return { x, y };
  };

  const getPolygonColor = (polygon: Polygon) => {
    if (polygon.id === selectedSectorId) {
      return polygon.type === "weed" 
        ? "rgba(239, 68, 68, 0.7)" 
        : "rgba(251, 146, 60, 0.7)";
    }
    
    const colors = {
      weed: {
        low: "rgba(239, 68, 68, 0.3)",
        medium: "rgba(239, 68, 68, 0.5)",
        high: "rgba(239, 68, 68, 0.7)",
      },
      failure: {
        low: "rgba(251, 146, 60, 0.3)",
        medium: "rgba(251, 146, 60, 0.5)",
        high: "rgba(251, 146, 60, 0.7)",
      },
    };
    
    return colors[polygon.type][polygon.severity];
  };

  const getStrokeColor = (polygon: Polygon) => {
    return polygon.id === selectedSectorId 
      ? "rgb(255, 255, 255)" 
      : polygon.type === "weed" 
      ? "rgb(220, 38, 38)" 
      : "rgb(234, 88, 12)";
  };

  return (
    <Card className="p-4 bg-muted/20">
      <div className="relative w-full h-[500px] bg-background rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid de fundo */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />
          
          {/* Área total da propriedade */}
          <rect
            x="50"
            y="50"
            width="700"
            height="500"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="hsl(var(--success))"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Polígonos de infestação */}
          {polygons.map((polygon) => {
            const points = polygon.coordinates
              .map((coord) => {
                const { x, y } = toSVGCoords(coord.lat, coord.lng);
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <g key={polygon.id}>
                <polygon
                  points={points}
                  fill={getPolygonColor(polygon)}
                  stroke={getStrokeColor(polygon)}
                  strokeWidth={polygon.id === selectedSectorId ? "3" : "1.5"}
                  className="transition-all duration-300"
                />
                <text
                  x={polygon.coordinates.reduce((sum, c) => sum + toSVGCoords(c.lat, c.lng).x, 0) / polygon.coordinates.length}
                  y={polygon.coordinates.reduce((sum, c) => sum + toSVGCoords(c.lat, c.lng).y, 0) / polygon.coordinates.length}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-semibold"
                  style={{ pointerEvents: "none" }}
                >
                  {polygon.id}
                </text>
              </g>
            );
          })}

          {/* Coordenadas de referência */}
          <text x="60" y="570" className="fill-muted-foreground text-xs">
            {center.lat.toFixed(4)}°S, {center.lng.toFixed(4)}°W
          </text>
        </svg>

        {/* Legenda */}
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(239, 68, 68, 0.5)" }} />
              <span>Plantas Daninhas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(251, 146, 60, 0.5)" }} />
              <span>Falhas de Plantio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-dashed" style={{ borderColor: "hsl(var(--success))" }} />
              <span>Área Total</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
