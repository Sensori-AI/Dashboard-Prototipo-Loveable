import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectorList } from "@/components/dashboard/SectorList";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface Sector {
  id: string;
  name: string;
  area: number;
  infestationLevel: "high" | "medium" | "low";
  percentage: number;
  coordinates: { lat: number; lng: number };
}

const mockVigorSectors: Sector[] = [
  { id: "v1", name: "Setor F-1", area: 18.3, infestationLevel: "high", percentage: 82.5, coordinates: { lat: -23.5505, lng: -46.6333 } },
  { id: "v2", name: "Setor F-2", area: 14.7, infestationLevel: "medium", percentage: 65.3, coordinates: { lat: -23.5515, lng: -46.6343 } },
  { id: "v3", name: "Setor G-1", area: 9.2, infestationLevel: "low", percentage: 42.8, coordinates: { lat: -23.5525, lng: -46.6353 } },
  { id: "v4", name: "Setor G-2", area: 16.5, infestationLevel: "high", percentage: 78.9, coordinates: { lat: -23.5535, lng: -46.6363 } },
  { id: "v5", name: "Setor H-1", area: 12.1, infestationLevel: "medium", percentage: 58.4, coordinates: { lat: -23.5545, lng: -46.6373 } },
];

const vigorChartData = [
  { name: "F-1", value: 18.3, percentage: 82.5 },
  { name: "F-2", value: 14.7, percentage: 65.3 },
  { name: "G-1", value: 9.2, percentage: 42.8 },
  { name: "G-2", value: 16.5, percentage: 78.9 },
  { name: "H-1", value: 12.1, percentage: 58.4 },
];

const Vigor = () => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  return (
    <DashboardLayout>
      <div id="dashboard-content" className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Vigor da Cultura</h1>
            <p className="text-muted-foreground">Análise de desenvolvimento vegetativo</p>
          </div>
          <Badge variant="default" className="gap-2 bg-success text-success-foreground">
            <TrendingUp className="h-4 w-4" />
            52.8% em Alto Vigor
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mapa de Vigor</CardTitle>
            </CardHeader>
            <CardContent>
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
                          Vigor: {selectedSector.percentage}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setores Analisados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SectorList
                sectors={mockVigorSectors}
                onSectorClick={setSelectedSector}
                selectedSectorId={selectedSector?.id}
                type="vigor"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Vigor</CardTitle>
          </CardHeader>
          <CardContent>
            <StatisticsChart data={vigorChartData} title="Níveis de Vigor (%)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise do Vigor</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              A análise de vigor indica que 52.8% da área total apresenta alto desenvolvimento vegetativo, 
              demonstrando boa saúde das plantas. Os Setores F-1 e G-2 destacam-se com vigor acima de 78%, 
              indicando condições ideais de crescimento. Áreas com vigor médio (31.5%) podem se beneficiar 
              de aplicação localizada de nutrientes. As zonas de baixo vigor (15.7%) requerem investigação 
              adicional para identificar possíveis deficiências nutricionais ou problemas no solo.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vigor;
