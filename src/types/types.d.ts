// src/types/geospatial.ts

export type SeverityLevel = "low" | "medium" | "high";

export type PolygonData = {
  nome?: string;
  coordenadas: [number, number][]; // [latitude, longitude][]
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type RawData = {
  nome: string;
  coordenadas: { latitude: number; longitude: number }[];
};

export type Polygon = {
  id: string;
  coordinates: Coordinates[]; // { lat, lng }[]
  type: "weed" | "failure" | "vigor"; // Adicionando 'vigor' para maior flexibilidade
  severity: SeverityLevel;
};

export type SectorData = {
  id: string;
  name: string;
  // coordinates: Coordinates[]; // Removido, pois não é usado na listagem
  type: "weed" | "failures" | "vigor";
  severity: SeverityLevel;
  center: Coordinates; // Centroide do setor
  area: number; // Área em Ha (como number)
  percentage: number;
};

// Mock data
export const mockVigorSectors: SectorData[] = [
  {
    id: "v1",
    name: "Setor F-1",
    area: 18.3,
    severity: "high",
    percentage: 82.5,
    type: "vigor",
    center: { lat: -23.5505, lng: -46.6333 },
  },
  {
    id: "v2",
    name: "Setor F-2",
    area: 14.7,
    severity: "medium",
    percentage: 65.3,
    type: "vigor",
    center: { lat: -23.5515, lng: -46.6343 },
  },
  {
    id: "v3",
    name: "Setor G-1",
    area: 9.2,
    severity: "low",
    percentage: 42.8,
    type: "vigor",
    center: { lat: -23.5525, lng: -46.6353 },
  },
];
