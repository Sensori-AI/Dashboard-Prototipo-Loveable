// src/hooks/useGeoData.ts

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  PolygonData,
  RawData,
  SectorData,
  Polygon,
  SeverityLevel,
  Coordinates,
} from "@/types/types";
import { areaHa, centroid } from "../lib/geo";

// Helper para padronizar dados brutos (RawData -> PolygonData)
const processRawData = (data: RawData[]): PolygonData[] => {
  return Array.isArray(data)
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
};

// Hook principal
export const useGeoData = (type: "weed" | "failure") => {
  const [polygonData, setPolygonData] = useState<PolygonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dataPath =
    type === "weed" ? "/data/ervas-daninhas.json" : "/data/falhas.json";
  const errorMsg = type === "weed" ? "ervas daninhas" : "falhas";
  const namePrefix = type === "weed" ? "W" : "F";
  const nameDefault = type === "weed" ? "Setor W" : "Falha";

  useEffect(() => {
    setIsLoading(true);
    fetch(dataPath)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar dados");
        return res.json();
      })
      .then((data: RawData[]) => {
        setPolygonData(processRawData(data));
      })
      .catch((err) => {
        console.error(`Erro ao carregar JSON de ${errorMsg}:`, err);
        toast.error(`Erro ao carregar dados de ${errorMsg}`);
        setPolygonData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dataPath, errorMsg]);

  const processedData = useMemo(() => {
    if (polygonData.length === 0) return { sectors: [], polygons: [] };

    const sectorsWithArea = polygonData.map((polygon) => {
      const area = Number(areaHa(polygon.coordenadas)); // areaHa retorna string, convertemos para number
      return { polygon, area };
    });

    const totalArea = sectorsWithArea.reduce(
      (total, { area }) => total + area,
      0
    );

    const sectors: SectorData[] = sectorsWithArea.map(
      ({ polygon, area }, index) => {
        const percentage = totalArea > 0 ? (area / totalArea) * 100 : 0;

        // centroid do turf retorna [lon, lat], mas SectorData.center espera { lat, lng }
        const [lon, lat] = centroid(polygon.coordenadas);

        const severity: SeverityLevel =
          percentage > 30 ? "high" : percentage > 15 ? "medium" : "low";

        return {
          id: `${namePrefix}-${index + 1}`,
          name: polygon.nome || `${nameDefault} ${index + 1}`,
          area,
          severity,
          percentage: Number(percentage.toFixed(2)),
          type: type === "weed" ? "weeds" : "failures",
          center: { lat, lng: lon } as Coordinates, // Conversão crucial para { lat, lng }
        };
      }
    );

    const mapPolygons: Polygon[] = polygonData.map((polygon, index) => ({
      id: sectors[index].id,
      // Converte [lat, lon][] para { lat, lng }[]
      coordinates: polygon.coordenadas.map(
        ([lat, lng]) => ({ lat, lng } as Coordinates)
      ),
      type: type,
      severity: sectors[index].severity,
    }));

    return { sectors, polygons: mapPolygons };
  }, [polygonData, namePrefix, nameDefault, type]);

  return { ...processedData, isLoading };
};
