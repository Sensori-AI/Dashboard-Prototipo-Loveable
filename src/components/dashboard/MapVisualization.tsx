import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorList } from "./SectorList";
import { GeographicMap } from "./GeographicMap";
import { toast } from "sonner";

interface Sector {
  id: string;
  name: string;
  area: number;
  infestationLevel: "high" | "medium" | "low";
  percentage: number;
  coordinates: { lat: number; lng: number };
}

// Coordenadas centrais da propriedade (mock - região de soja no Brasil)
const farmCenter = { lat: -23.5505, lng: -46.6333 };

// Mock data - polígonos geográficos para plantas daninhas
const mockWeedPolygons = [
  {
    id: "S-001",
    coordinates: [
      { lat: -23.548, lng: -46.635 },
      { lat: -23.547, lng: -46.633 },
      { lat: -23.549, lng: -46.632 },
      { lat: -23.550, lng: -46.634 },
    ],
    type: "weed" as const,
    severity: "high" as const,
  },
  {
    id: "S-003",
    coordinates: [
      { lat: -23.552, lng: -46.631 },
      { lat: -23.551, lng: -46.629 },
      { lat: -23.553, lng: -46.628 },
      { lat: -23.554, lng: -46.630 },
    ],
    type: "weed" as const,
    severity: "medium" as const,
  },
  {
    id: "S-007",
    coordinates: [
      { lat: -23.549, lng: -46.637 },
      { lat: -23.548, lng: -46.636 },
      { lat: -23.550, lng: -46.635 },
      { lat: -23.551, lng: -46.636 },
    ],
    type: "weed" as const,
    severity: "low" as const,
  },
];

// Mock data - polígonos geográficos para falhas de plantio
const mockFailurePolygons = [
  {
    id: "S-002",
    coordinates: [
      { lat: -23.551, lng: -46.634 },
      { lat: -23.550, lng: -46.632 },
      { lat: -23.552, lng: -46.631 },
      { lat: -23.553, lng: -46.633 },
    ],
    type: "failure" as const,
    severity: "high" as const,
  },
  {
    id: "S-005",
    coordinates: [
      { lat: -23.553, lng: -46.636 },
      { lat: -23.552, lng: -46.635 },
      { lat: -23.554, lng: -46.634 },
      { lat: -23.555, lng: -46.635 },
    ],
    type: "failure" as const,
    severity: "medium" as const,
  },
];

// Mock data - setores para a lista lateral
const mockWeedSectors: Sector[] = [
  { id: "S-001", name: "Setor A-1", area: 12.5, infestationLevel: "high", percentage: 32.5, coordinates: { lat: -23.5490, lng: -46.6335 } },
  { id: "S-003", name: "Setor A-2", area: 8.3, infestationLevel: "medium", percentage: 18.2, coordinates: { lat: -23.5525, lng: -46.6295 } },
  { id: "S-007", name: "Setor B-1", area: 15.7, infestationLevel: "high", percentage: 28.9, coordinates: { lat: -23.5500, lng: -46.6360 } },
];

const mockFailureSectors: Sector[] = [
  { id: "S-002", name: "Setor D-1", area: 5.2, infestationLevel: "medium", percentage: 15.3, coordinates: { lat: -23.5515, lng: -46.6325 } },
  { id: "S-005", name: "Setor D-2", area: 7.8, infestationLevel: "high", percentage: 24.8, coordinates: { lat: -23.5535, lng: -46.6355 } },
];

const mockVigorSectors: Sector[] = [
  { id: "v1", name: "Setor F-1", area: 18.3, infestationLevel: "high", percentage: 82.5, coordinates: { lat: -23.5505, lng: -46.6333 } },
  { id: "v2", name: "Setor F-2", area: 14.7, infestationLevel: "medium", percentage: 65.3, coordinates: { lat: -23.5515, lng: -46.6343 } },
  { id: "v3", name: "Setor G-1", area: 9.2, infestationLevel: "low", percentage: 42.8, coordinates: { lat: -23.5525, lng: -46.6353 } },
  { id: "v4", name: "Setor G-2", area: 16.5, infestationLevel: "high", percentage: 78.9, coordinates: { lat: -23.5535, lng: -46.6363 } },
  { id: "v5", name: "Setor H-1", area: 12.1, infestationLevel: "medium", percentage: 58.4, coordinates: { lat: -23.5545, lng: -46.6373 } },
];

export const MapVisualization = () => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [activeTab, setActiveTab] = useState("weeds");

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    toast.success(`Focando no ${sector.name}`, {
      description: `Área: ${sector.area.toFixed(2)} ha | Nível: ${sector.infestationLevel}`,
    });
  };

  const getSectorsForTab = () => {
    switch (activeTab) {
      case "weeds":
        return mockWeedSectors;
      case "failures":
        return mockFailureSectors;
      case "vigor":
        return mockVigorSectors;
      default:
        return [];
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Visualização Georreferenciada</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weeds" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weeds">Plantas Daninhas</TabsTrigger>
            <TabsTrigger value="failures">Falhas de Plantio</TabsTrigger>
            <TabsTrigger value="vigor">Mapa de Vigor</TabsTrigger>
          </TabsList>

          <TabsContent value="weeds" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <GeographicMap 
                  polygons={mockWeedPolygons}
                  selectedSectorId={selectedSector?.id}
                  center={farmCenter}
                />
              </div>
              <div>
                <SectorList
                  sectors={mockWeedSectors}
                  onSectorClick={handleSectorClick}
                  selectedSectorId={selectedSector?.id}
                  type="weeds"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="failures" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <GeographicMap 
                  polygons={mockFailurePolygons}
                  selectedSectorId={selectedSector?.id}
                  center={farmCenter}
                />
              </div>
              <div>
                <SectorList
                  sectors={mockFailureSectors}
                  onSectorClick={handleSectorClick}
                  selectedSectorId={selectedSector?.id}
                  type="failures"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vigor" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground font-semibold">
                        Mapa de Vigor da Cultura
                      </p>
                      {selectedSector && (
                        <div className="mt-4 p-4 bg-card rounded-lg border border-primary">
                          <p className="text-xs text-primary font-semibold">
                            📍 Focado em: {selectedSector.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Lat: {selectedSector.coordinates.lat.toFixed(4)}, Lng: {selectedSector.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Análise de vigor: alto, médio e baixo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <SectorList
                  sectors={mockVigorSectors}
                  onSectorClick={handleSectorClick}
                  selectedSectorId={selectedSector?.id}
                  type="vigor"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
