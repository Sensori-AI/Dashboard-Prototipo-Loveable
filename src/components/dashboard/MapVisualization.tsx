// src/components/dashboard/MapVisualization.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorList } from "./SectorList";
import GeographicMap from "./GeographicMap";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, BarChart3 } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  area: number; // hectares
  infestationLevel: "high" | "medium" | "low";
  percentage: number;
  coordinates: { lat: number; lng: number };
}

/* === POLÍGONO REAL DO CLIENTE (do KML) === */
export const userPolygon = [
  { lat: -24.78306049887476, lng: -53.61900349436017 },
  { lat: -24.77433558965578, lng: -53.61414552543608 },
  { lat: -24.77361458711221, lng: -53.6157411438456 },
  { lat: -24.78232624780349, lng: -53.62057096723302 },
  { lat: -24.78306049887476, lng: -53.61900349436017 }, // fechamento
];

const farmCenter = { lat: -24.7792794844642, lng: -53.617692925047 };

/* único conjunto de polígonos (pode expandir por aba depois) */
const clientPolygons = [
  {
    id: "S-USER-01",
    coordinates: userPolygon,
    type: "user" as const,
    severity: "high" as const,
    name: "Área Real do Cliente",
  },
];

const clientSectorList: Sector[] = [
  {
    id: "S-USER-01",
    name: "Área Real do Cliente",
    area: 19.4353,
    infestationLevel: "high",
    percentage: 100,
    coordinates: farmCenter,
  },
];

export const MapVisualization: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>({
    id: "S-USER-01",
    name: "Área Real do Cliente",
    area: 19.4353,
    infestationLevel: "high",
    percentage: 100,
    coordinates: farmCenter,
  });

  const [activeTab, setActiveTab] = useState<string>("weeds");

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    toast.success(`Focando em ${sector.name}`, {
      description: `Área: ${sector.area.toFixed(2)} ha`,
    });
  };

  return (
    <div className="space-y-6">
      {/* === MAPA PRINCIPAL (TOPO) === */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Visualização Georreferenciada</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mapa ocupa 2/3 */}
            <div className="lg:col-span-2">
              <GeographicMap
                polygons={clientPolygons}
                selectedSectorId={selectedSector?.id}
                center={farmCenter}
                zoom={17}
                height="520px"
              />
            </div>

            {/* Lista lateral (setores) */}
            <div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Setores com Infestação</h4>
                <p className="text-xs text-muted-foreground mb-4">{clientSectorList.length} setores identificados</p>
                <SectorList
                  sectors={clientSectorList}
                  onSectorClick={handleSectorClick}
                  selectedSectorId={selectedSector?.id}
                  type="weeds"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === ABAS COM OS CARDS ABAIXO (sem mapas) === */}
      <Card className="col-span-full">
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weeds">Plantas Daninhas</TabsTrigger>
              <TabsTrigger value="failures">Falhas de Plantio</TabsTrigger>
              <TabsTrigger value="vigor">Mapa de Vigor</TabsTrigger>
            </TabsList>

            {/* WEEDS tab */}
            <TabsContent value="weeds" className="mt-4">
              <Card className="overflow-hidden animate-fade-in">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Search className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Detecção de Daninhas</h3>
                      <p className="text-sm text-muted-foreground">Comparação antes/depois - Fazenda Boa Vista, GO</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="outline" className="mb-2">Antes - Imagem bruta</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
                        <img src="/images/weed-before.png" alt="Antes - Lavoura" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Imagem original da lavoura sem marcações</p>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="default" className="mb-2 bg-destructive text-destructive-foreground">Depois - IA</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-destructive shadow-sm">
                        <img src="/images/weed-after.png" alt="Depois - Deteção IA" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">IA realça focos de infestação e áreas de atenção</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm text-foreground">
                      <strong>Resultado:</strong> 7 focos de daninhas identificados precocemente. Intervenção localizada evitou propagação para mais de <strong>85 hectares</strong>.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* FAILURES tab */}
            <TabsContent value="failures" className="mt-4">
              <Card className="overflow-hidden animate-fade-in">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Identificação de Falhas de Plantio</h3>
                      <p className="text-sm text-muted-foreground">Geração de insights - Fazenda Esperança, BA</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="outline" className="mb-2">Antes - Processo Manual</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
                        <img src="/images/planting-before.png" alt="Antes - Manual" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Coleta/compilação manual de dados (3–5 dias)</p>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="default" className="mb-2 bg-accent text-accent-foreground">Depois - Geração Automática</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-accent shadow-sm">
                        <img src="/images/planting-after.png" alt="Depois - IA" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Relatório gerado pela IA em minutos, com recomendações para correção</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-foreground">
                      <strong>Resultado:</strong> Relatórios automatizados liberaram ~20h/mês da equipe técnica e permitiram correções rápidas, melhorando uniformidade do plantio.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* VIGOR tab */}
            <TabsContent value="vigor" className="mt-4">
              <Card className="overflow-hidden animate-fade-in">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Mapa de Vigor NDVI</h3>
                      <p className="text-sm text-muted-foreground">Análise de saúde vegetal - Fazenda São João, MT</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="outline" className="mb-2">Antes - Imagem RGB (satélite)</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
                        <img src="/images/ndvi-before.jpg" alt="Antes - RGB" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Imagem RGB capturada por satélite</p>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="default" className="mb-2 bg-success text-success-foreground">Depois - Mapa NDVI</Badge>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-success shadow-sm">
                        <img src="/images/ndvi-after.jpg" alt="Depois - NDVI" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Mapa NDVI processado pela IA — Verde = saudável, Amarelo = atenção, Vermelho = problema</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-foreground">
                      <strong>Resultado:</strong> Identificados 3 setores com baixo vigor (12% da área total). Aplicação direcionada economizou R$ 18.400 em fertilizantes.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapVisualization;
