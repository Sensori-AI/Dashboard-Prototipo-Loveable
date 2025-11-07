import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectorList } from "@/components/dashboard/SectorList";
import { GeographicMap } from "@/components/dashboard/GeographicMap";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface Sector {
  id: string;
  name: string;
  area: number;
  infestationLevel: "high" | "medium" | "low";
  percentage: number;
  coordinates: { lat: number; lng: number };
}

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
];

const mockWeedSectors: Sector[] = [
  { id: "S-001", name: "Setor A-1", area: 12.5, infestationLevel: "high", percentage: 32.5, coordinates: { lat: -23.5490, lng: -46.6335 } },
  { id: "S-003", name: "Setor A-2", area: 8.3, infestationLevel: "medium", percentage: 18.2, coordinates: { lat: -23.5525, lng: -46.6295 } },
  { id: "S-007", name: "Setor B-1", area: 15.7, infestationLevel: "high", percentage: 28.9, coordinates: { lat: -23.5500, lng: -46.6360 } },
];

const weedsChartData = [
  { name: "S-001", value: 12.5, percentage: 32.5 },
  { name: "S-003", value: 8.3, percentage: 18.2 },
  { name: "S-007", value: 15.7, percentage: 28.9 },
];

const Weeds = () => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  return (
    <DashboardLayout>
      <div id="dashboard-content" className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Plantas Daninhas</h1>
            <p className="text-muted-foreground">Análise detalhada de infestação</p>
          </div>
          <Badge variant="destructive" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            3 Setores com Alta Infestação
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mapa de Infestação</CardTitle>
            </CardHeader>
            <CardContent>
              <GeographicMap
                polygons={mockWeedPolygons}
                selectedSectorId={selectedSector?.id}
                center={{ lat: -23.5505, lng: -46.6333 }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setores Identificados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SectorList
                sectors={mockWeedSectors}
                onSectorClick={setSelectedSector}
                selectedSectorId={selectedSector?.id}
                type="weeds"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Infestação</CardTitle>
          </CardHeader>
          <CardContent>
            <StatisticsChart data={weedsChartData} title="Níveis de Infestação (%)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações Detalhadas</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Após análise da IA, foram identificadas plantas daninhas em 3 setores principais da lavoura. 
              O Setor A-1 apresenta o maior nível de infestação (32.5% da área), seguido pelo Setor B-1 (28.9%). 
              As espécies predominantes incluem Buva e Capim-Amargoso, que requerem intervenção imediata 
              para evitar perdas de produtividade.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Weeds;
