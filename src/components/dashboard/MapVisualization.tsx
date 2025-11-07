import { useEffect, useMemo, useState } from "react";
import { GeographicMap, Coordinates, PolygonType } from "./GeographicMap";
import { toast } from "sonner";
import { Loading } from "../ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { areaHa, centroid } from "@/lib/geo";

// Types para os dados
interface PolygonData {
  nome: string;
  coordenadas: [number, number][];
}

interface RawDataItem {
  nome?: string;
  coordenadas: Array<{
    latitude: number;
    longitude: number;
  }>;
}

interface Sector {
  id: string;
  name: string;
  area: number;
  infestationLevel: "low" | "medium" | "high";
  percentage: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Mock data para vigor
const mockVigorSectors: Sector[] = [
  {
    id: "v1",
    name: "Setor F-1",
    area: 18.3,
    infestationLevel: "high",
    percentage: 82.5,
    coordinates: { latitude: -23.5505, longitude: -46.6333 },
  },
  {
    id: "v2",
    name: "Setor F-2",
    area: 14.7,
    infestationLevel: "medium",
    percentage: 65.3,
    coordinates: { latitude: -23.5515, longitude: -46.6343 },
  },
  {
    id: "v3",
    name: "Setor G-1",
    area: 9.2,
    infestationLevel: "low",
    percentage: 42.8,
    coordinates: { latitude: -23.5525, longitude: -46.6353 },
  },
];

// Componente de lista de setores
interface SectorListProps {
  sectors: Sector[];
  onSectorClick: (sector: Sector) => void;
  selectedSectorId?: string;
  type: "weeds" | "failures" | "vigor";
}

const SectorList = ({
  sectors,
  onSectorClick,
  selectedSectorId,
  type,
}: SectorListProps) => {
  const getInfestationColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "weeds":
        return "Plantas Daninhas";
      case "failures":
        return "Falhas de Plantio";
      case "vigor":
        return "Vigor";
      default:
        return "Setores";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-[500px] overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">Setores - {getTypeLabel()}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {sectors.length} setores encontrados
        </p>
      </div>

      <div className="overflow-y-auto h-[calc(100%-80px)]">
        {sectors.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhum setor encontrado
          </div>
        ) : (
          sectors.map((sector) => (
            <div
              key={sector.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedSectorId === sector.id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onSectorClick(sector)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{sector.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Área: {sector.area.toFixed(2)} ha
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getInfestationColor(
                    sector.infestationLevel
                  )}`}
                >
                  {sector.infestationLevel === "high"
                    ? "Alta"
                    : sector.infestationLevel === "medium"
                    ? "Média"
                    : "Baixa"}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>ID: {sector.id}</span>
                <span>{sector.percentage.toFixed(1)}%</span>
              </div>

              {selectedSectorId === sector.id && (
                <div className="mt-2 text-xs text-blue-600 font-semibold">
                  ✓ Selecionado
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Componente principal
export const MapVisualization = () => {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("weeds");

  const [falhas, setFalhas] = useState<PolygonData[]>([]);
  const [ervas, setErvas] = useState<PolygonData[]>([]);

  // Estados de loading
  const [loadingWeeds, setLoadingWeeds] = useState(true);
  const [loadingFailures, setLoadingFailures] = useState(true);

  // Boundaries da fazenda
  const farmBoundary: Coordinates[] = [
    { lat: -24.76903205, lng: -53.61433973 },
    { lat: -24.76660228, lng: -53.61436247 },
    { lat: -24.76657223, lng: -53.61019779 },
    { lat: -24.76160818, lng: -53.61017136 },
    { lat: -24.76165575, lng: -53.61566249 },
    { lat: -24.76570689, lng: -53.6156352 },
    { lat: -24.76572836, lng: -53.61723939 },
    { lat: -24.76839536, lng: -53.61722885 },
    { lat: -24.76903205, lng: -53.61433973 },
  ];

  // Calcular centro da fazenda
  const calculateFarmCenter = (boundaries: Coordinates[]): Coordinates => {
    if (boundaries.length === 0) return { lat: -23.5505, lng: -46.6333 };

    const sum = boundaries.reduce(
      (acc, coord) => {
        acc.lat += coord.lat;
        acc.lng += coord.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: sum.lat / boundaries.length,
      lng: sum.lng / boundaries.length,
    };
  };

  const farmCenter = calculateFarmCenter(farmBoundary);

  const handleSectorClick = (sector: Sector) => {
    if (selectedSectorId === sector.id) {
      setSelectedSectorId(null);
      toast.info("Desselecionado", {
        description: `Setor ${sector.name} desselecionado`,
      });
    } else {
      setSelectedSectorId(sector.id);
      toast.success(`Focando no ${sector.name}`, {
        description: `Área: ${sector.area.toFixed(2)} ha | Nível: ${
          sector.infestationLevel
        }`,
      });
    }
  };

  const handleSectorSelect = (sectorId: string | null) => {
    setSelectedSectorId(sectorId);
  };

  // Limpar seleção ao trocar de aba
  useEffect(() => {
    setSelectedSectorId(null);
  }, [activeTab]);

  // Carrega dados de falhas
  useEffect(() => {
    setLoadingFailures(true);
    fetch("/data/falhas.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar dados");
        return res.json();
      })
      .then((data: RawDataItem[]) => {
        const safePolygons = Array.isArray(data)
          ? data
              .filter(
                (p) =>
                  p?.coordenadas &&
                  Array.isArray(p.coordenadas) &&
                  p.coordenadas.length > 0
              )
              .map((polygon) => ({
                nome: polygon?.nome ?? "",
                coordenadas: polygon.coordenadas.map((coord) => [
                  coord.latitude,
                  coord.longitude,
                ]),
              }))
          : [];
        setFalhas(safePolygons as PolygonData[]);
      })
      .catch((err) => {
        console.error("Erro ao carregar JSON de falhas:", err);
        toast.error("Erro ao carregar dados de falhas");
      })
      .finally(() => {
        setLoadingFailures(false);
      });
  }, []);

  // Carrega dados de ervas daninhas
  useEffect(() => {
    setLoadingWeeds(true);
    fetch("/data/ervas-daninhas.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar dados");
        return res.json();
      })
      .then((data: RawDataItem[]) => {
        const safePolygons = Array.isArray(data)
          ? data
              .filter(
                (p) =>
                  p?.coordenadas &&
                  Array.isArray(p.coordenadas) &&
                  p.coordenadas.length > 0
              )
              .map((polygon) => ({
                nome: polygon?.nome ?? "",
                coordenadas: polygon.coordenadas.map((coord) => [
                  coord.latitude,
                  coord.longitude,
                ]),
              }))
          : [];
        setErvas(safePolygons as PolygonData[]);
      })
      .catch((err) => {
        console.error("Erro ao carregar JSON de ervas:", err);
        toast.error("Erro ao carregar dados de ervas daninhas");
      })
      .finally(() => {
        setLoadingWeeds(false);
      });
  }, []);

  // Processa dados de ervas daninhas
  const weedData = useMemo(() => {
    if (ervas.length === 0) return { sectors: [], polygons: [] };

    const totalAreaWeed = ervas.reduce((total, erva) => {
      return total + Number(areaHa(erva.coordenadas));
    }, 0);

    const sectors: Sector[] = ervas.map((erva, index) => {
      const area = Number(areaHa(erva.coordenadas));
      const percentage = totalAreaWeed > 0 ? (area / totalAreaWeed) * 100 : 0;

      return {
        id: `W-${index + 1}`,
        name: erva.nome || `Setor W-${index + 1}`,
        area,
        infestationLevel:
          percentage > 30 ? "high" : percentage > 15 ? "medium" : "low",
        percentage: Number(percentage.toFixed(2)),
        coordinates: {
          latitude: centroid(erva.coordenadas)[0],
          longitude: centroid(erva.coordenadas)[1],
        },
      };
    });

    const polygons: PolygonType[] = ervas.map((erva, index) => ({
      id: `W-${index + 1}`,
      coordinates: erva.coordenadas.map(([lat, lng]) => ({ lat, lng })),
      type: "weed" as const,
      severity: sectors[index].infestationLevel,
    }));

    return { sectors, polygons };
  }, [ervas]);

  // Processa dados de falhas
  const failureData = useMemo(() => {
    if (falhas.length === 0) return { sectors: [], polygons: [] };

    const totalAreaFailure = falhas.reduce((total, falha) => {
      return total + Number(areaHa(falha.coordenadas));
    }, 0);

    const sectors: Sector[] = falhas.map((falha, index) => {
      const area = Number(areaHa(falha.coordenadas));
      const percentage =
        totalAreaFailure > 0 ? (area / totalAreaFailure) * 100 : 0;

      return {
        id: `F-${index + 1}`,
        name: falha.nome || `Falha ${index + 1}`,
        area,
        infestationLevel:
          percentage > 30 ? "high" : percentage > 15 ? "medium" : "low",
        percentage: Number(percentage.toFixed(2)),
        coordinates: {
          latitude: centroid(falha.coordenadas)[0],
          longitude: centroid(falha.coordenadas)[1],
        },
      };
    });

    const polygons: PolygonType[] = falhas.map((falha, index) => ({
      id: `F-${index + 1}`,
      coordinates: falha.coordenadas.map(([lat, lng]) => ({ lat, lng })),
      type: "failure" as const,
      severity: sectors[index].infestationLevel,
    }));

    return { sectors, polygons };
  }, [falhas]);

  // Loading component para a lista
  const ListLoading = () => (
    <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Carregando setores...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 col-span-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Visualização Georreferenciada</h2>
      </div>

      <div className="p-6">
        <Tabs defaultValue="weeds" onValueChange={setActiveTab}>
          <TabsList className="w-full grid-cols-3">
            <TabsTrigger value="weeds">Plantas Daninhas</TabsTrigger>
            <TabsTrigger value="failures">Falhas de Plantio</TabsTrigger>
            <TabsTrigger value="vigor">Mapa de Vigor</TabsTrigger>
          </TabsList>

          <TabsContent value="weeds">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <GeographicMap
                  polygons={weedData.polygons}
                  selectedSectorId={selectedSectorId || undefined}
                  center={farmCenter}
                  farmBoundaries={farmBoundary}
                  height="500px"
                  zoom={14}
                  isLoading={loadingWeeds}
                  onSectorSelect={handleSectorSelect}
                />
              </div>
              <div>
                {loadingWeeds ? (
                  <Loading />
                ) : (
                  <SectorList
                    sectors={weedData.sectors}
                    onSectorClick={handleSectorClick}
                    selectedSectorId={selectedSectorId || undefined}
                    type="weeds"
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="failures">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <GeographicMap
                  polygons={failureData.polygons}
                  selectedSectorId={selectedSectorId || undefined}
                  center={farmCenter}
                  farmBoundaries={farmBoundary}
                  height="500px"
                  zoom={14}
                  isLoading={loadingFailures}
                  onSectorSelect={handleSectorSelect}
                />
              </div>
              <div>
                {loadingFailures ? (
                  <Loading />
                ) : (
                  <SectorList
                    sectors={failureData.sectors}
                    onSectorClick={handleSectorClick}
                    selectedSectorId={selectedSectorId || undefined}
                    type="failures"
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vigor">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600 font-semibold">
                        Mapa de Vigor da Cultura
                      </p>
                      {selectedSectorId && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-500">
                          <p className="text-xs text-blue-600 font-semibold">
                            📍 Focado em: {selectedSectorId}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600">
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
                  selectedSectorId={selectedSectorId || undefined}
                  type="vigor"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
