import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map } from "leaflet";

interface PolygonData {
  nome?: string;
  coordenadas: [number, number][];
}

interface MiniMapProps {
  center: [number, number];
  boundary?: [number, number][];
  detectionBoundary?: PolygonData[];
  height?: string;
  zoom?: number;
  autoFit?: boolean;
  onMapReady?: (map: Map) => void;
  highlightedPolygon?: PolygonData | null;
  colorHighlighted?: "error" | "warning";
}

function FitBounds({
  boundary = [],
  polygons = [],
  autoFit = true,
}: {
  boundary?: [number, number][];
  polygons?: PolygonData[];
  autoFit?: boolean;
}) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!autoFit || hasFitted.current) return;

    const allCoords: [number, number][] = [
      ...(boundary || []),
      ...polygons.flatMap((p) => p.coordenadas || []),
    ];

    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [20, 20], animate: false });
      hasFitted.current = true;
    }
  }, [boundary, polygons, map, autoFit]);

  return null;
}

function MapReadyHandler({ onMapReady }: { onMapReady?: (map: Map) => void }) {
  const map = useMap();
  useEffect(() => {
    if (onMapReady) onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

export function MiniMap({
  center,
  boundary = [],
  detectionBoundary = [],
  height = "150px",
  zoom = 15,
  autoFit = true,
  onMapReady,
  colorHighlighted,
  highlightedPolygon = null,
}: MiniMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-full rounded-lg"
      style={{ height }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapReadyHandler onMapReady={onMapReady} />
      <FitBounds
        boundary={boundary}
        polygons={detectionBoundary}
        autoFit={autoFit}
      />

      {boundary.length > 0 && (
        <Polygon
          positions={boundary}
          pathOptions={{
            color: "var(--primary)",
            fillColor: "var(--secondary)",
            fillOpacity: 0.3,
            weight: 2,
          }}
        />
      )}

      {detectionBoundary &&
        detectionBoundary.map((poly, i) => {
          const isHighlighted =
            highlightedPolygon?.nome === poly.nome ||
            highlightedPolygon === poly;

          // Usa variável CSS conforme tipo selecionado
          const baseColor =
            colorHighlighted === "error" ? "var(--error)" : "var(--accent)";

          return (
            <Polygon
              key={poly.nome || i}
              positions={poly.coordenadas}
              pathOptions={{
                color: baseColor,
                fillColor: baseColor,
                fillOpacity: isHighlighted ? 0.7 : 0.4,
                weight: isHighlighted ? 4 : 2,
              }}
            >
              {poly.nome && <Tooltip sticky>{poly.nome}</Tooltip>}
            </Polygon>
          );
        })}
    </MapContainer>
  );
}
