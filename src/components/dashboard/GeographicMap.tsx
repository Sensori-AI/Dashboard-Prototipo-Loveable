import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para ícones do Leaflet no React puro
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PolygonType {
  id: string;
  coordinates: Coordinates[];
  type: "weed" | "failure";
  severity: "low" | "medium" | "high";
}

// Ícone customizado para os marcadores
const createCustomIcon = (color: string = "#3b82f6") => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    className: "custom-marker",
  });
};

// Componente para controlar o centro do mapa
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Componente para ajustar os bounds automaticamente
function FitBoundsController({
  boundary = [],
  polygons = [],
  autoFit = true,
  onBoundsFitted,
}: {
  boundary: [number, number][];
  polygons: PolygonType[];
  autoFit?: boolean;
  onBoundsFitted?: () => void;
}) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!autoFit || hasFitted.current || (!boundary.length && !polygons.length))
      return;

    try {
      const allCoords: [number, number][] = [];

      // Adiciona coordenadas do boundary
      if (boundary.length > 0) {
        allCoords.push(...boundary);
      }

      // Adiciona coordenadas dos polígonos
      polygons.forEach((polygon) => {
        if (polygon.coordinates && polygon.coordinates.length > 0) {
          polygon.coordinates.forEach((coord) => {
            if (coord.lat && coord.lng) {
              allCoords.push([coord.lat, coord.lng]);
            }
          });
        }
      });

      if (allCoords.length > 0) {
        map.fitBounds(allCoords, {
          padding: [20, 20],
          animate: true,
          maxZoom: 16,
        });
        hasFitted.current = true;
        onBoundsFitted?.();
      }
    } catch (error) {
      console.warn("Erro ao ajustar bounds do mapa:", error);
    }
  }, [boundary, polygons, map, autoFit, onBoundsFitted]);

  return null;
}

// Componente para controlar popups programaticamente
function PopupController({
  selectedSectorId,
  markers,
  onPopupClose,
}: {
  selectedSectorId?: string;
  markers: Map<string, L.Marker>;
  onPopupClose?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedSectorId && markers.has(selectedSectorId)) {
      const marker = markers.get(selectedSectorId);
      if (marker) {
        // Fecha todos os popups primeiro
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            layer.closePopup();
          }
        });

        // Abre o popup do marcador selecionado
        marker.openPopup();

        // Voa até o marcador
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), {
          animate: true,
          duration: 1,
        });
      }
    } else {
      // Fecha todos os popups se nenhum setor estiver selecionado
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.closePopup();
        }
      });
    }
  }, [selectedSectorId, markers, map]);

  // Listen for popup close events
  useEffect(() => {
    const handlePopupClose = () => {
      onPopupClose?.();
    };

    map.on("popupclose", handlePopupClose);

    return () => {
      map.off("popupclose", handlePopupClose);
    };
  }, [map, onPopupClose]);

  return null;
}

// Função para obter cores baseadas no tipo e severidade
const getPolygonStyle = (
  type: "weed" | "failure",
  severity: "low" | "medium" | "high"
) => {
  const baseColors = {
    weed: {
      low: "#4CAF50", // Verde claro
      medium: "#FF9800", // Laranja
      high: "#F44336", // Vermelho
    },
    failure: {
      low: "#2196F3", // Azul claro
      medium: "#FF5722", // Laranja escuro
      high: "#9C27B0", // Roxo
    },
  };

  const color = baseColors[type][severity];

  return {
    color: color,
    fillColor: color,
    fillOpacity: 0.4,
    weight: 2,
    opacity: 0.8,
  };
};

// Função para obter estilo de polígono destacado
const getHighlightedStyle = (
  type: "weed" | "failure",
  severity: "low" | "medium" | "high"
) => {
  const baseStyle = getPolygonStyle(type, severity);
  return {
    ...baseStyle,
    weight: 4,
    fillOpacity: 0.7,
    opacity: 1,
  };
};

// Função para obter cor do marcador baseado no tipo
const getMarkerColor = (type: "weed" | "failure") => {
  return type === "weed" ? "#ef4444" : "#8b5cf6";
};

interface GeographicMapProps {
  polygons: PolygonType[];
  selectedSectorId?: string;
  center: Coordinates;
  farmBoundaries?: Coordinates[];
  height?: string;
  zoom?: number;
  isLoading?: boolean;
  onSectorSelect?: (sectorId: string | null) => void;
}

// Componente para lidar com cliques no mapa
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

export const GeographicMap = ({
  polygons,
  selectedSectorId,
  center,
  farmBoundaries = [],
  height = "500px",
  zoom = 13,
  isLoading = false,
  onSectorSelect,
}: GeographicMapProps) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasData, setHasData] = useState(false);
  const markersRef = useRef(new Map<string, L.Marker>());

  // Converter boundaries para formato Leaflet
  const boundaryPositions: [number, number][] = farmBoundaries.map((coord) => [
    coord.lat,
    coord.lng,
  ]);

  // Converter center para formato Leaflet
  const mapCenter: [number, number] = [center.lat, center.lng];

  // Calcular bounds para o fitBounds
  const shouldAutoFit = polygons.length > 0 || boundaryPositions.length > 0;

  // Resetar estados quando os dados mudarem
  useEffect(() => {
    setHasData(polygons.length > 0 || boundaryPositions.length > 0);
  }, [polygons, boundaryPositions]);

  const handleBoundsFitted = () => {
    setIsMapReady(true);
  };

  const handlePopupClose = useCallback(() => {
    onSectorSelect?.(null);
  }, [onSectorSelect]);

  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      // Se clicar no mapa (não em um marcador), deseleciona o setor
      onSectorSelect?.(null);
    },
    [onSectorSelect]
  );

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg border border-border overflow-hidden flex items-center justify-center bg-muted"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">
            Carregando mapa...
          </p>
        </div>
      </div>
    );
  }

  // Se não há dados e não está carregando, mostrar estado vazio
  if (!hasData && !isLoading) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg border border-border overflow-hidden flex items-center justify-center bg-muted"
      >
        <div className="text-center">
          <div className="text-muted-foreground mb-2">🗺️</div>
          <p className="text-sm text-muted-foreground">
            Nenhum dado disponível para exibir
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height }}
      className="w-full rounded-lg border border-border overflow-hidden relative"
    >
      {/* Overlay de loading enquanto o mapa se ajusta */}
      {!isMapReady && hasData && (
        <div className="absolute inset-0 bg-background/80 z-[1000] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajustando visualização...
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
        whenReady={() => {
          if (!shouldAutoFit) {
            setIsMapReady(true);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Controladores do mapa */}
        <MapCenterController center={mapCenter} />
        <FitBoundsController
          boundary={boundaryPositions}
          polygons={polygons}
          autoFit={shouldAutoFit}
          onBoundsFitted={handleBoundsFitted}
        />

        {/* Controlador de popups */}
        <PopupController
          selectedSectorId={selectedSectorId}
          markers={markersRef.current}
          onPopupClose={handlePopupClose}
        />

        {/* Evento de clique no mapa */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Boundary da fazenda */}
        {boundaryPositions.length > 0 && (
          <Polygon
            positions={boundaryPositions}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
              weight: 3,
              dashArray: "5, 5",
              opacity: 0.8,
            }}
          >
            <Tooltip permanent direction="center" className="font-semibold">
              Limites da Propriedade
            </Tooltip>
          </Polygon>
        )}

        {/* Polígonos de detecção */}
        {polygons.map((polygon) => {
          if (!polygon.coordinates || polygon.coordinates.length === 0) {
            return null;
          }

          const positions: [number, number][] = polygon.coordinates.map(
            (coord) => [coord.lat, coord.lng]
          );

          const isSelected = polygon.id === selectedSectorId;
          const pathOptions = isSelected
            ? getHighlightedStyle(polygon.type, polygon.severity)
            : getPolygonStyle(polygon.type, polygon.severity);

          // Calcular centro do polígono
          const centerLat =
            positions.reduce((sum, [lat]) => sum + lat, 0) / positions.length;
          const centerLng =
            positions.reduce((sum, [, lng]) => sum + lng, 0) / positions.length;

          const severityText = {
            high: "Alta",
            medium: "Média",
            low: "Baixa",
          }[polygon.severity];

          const typeText =
            polygon.type === "weed" ? "Planta Daninha" : "Falha de Plantio";

          return (
            <div key={polygon.id}>
              <Polygon
                positions={positions}
                pathOptions={pathOptions}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    onSectorSelect?.(polygon.id);
                  },
                }}
              >
                <Tooltip
                  permanent
                  direction="center"
                  className="custom-tooltip"
                >
                  <div className="text-xs font-medium text-center">
                    <div className="font-bold">{polygon.id}</div>
                    <div className="capitalize">{typeText}</div>
                    <div>Severidade: {severityText}</div>
                    {isSelected && (
                      <div className="text-blue-600 font-bold mt-1">
                        ✓ SELECIONADO
                      </div>
                    )}
                  </div>
                </Tooltip>
              </Polygon>

              {/* Marcador no centro do polígono */}
              <Marker
                position={[centerLat, centerLng]}
                icon={createCustomIcon(getMarkerColor(polygon.type))}
                ref={(marker) => {
                  if (marker) {
                    markersRef.current.set(polygon.id, marker);
                  } else {
                    markersRef.current.delete(polygon.id);
                  }
                }}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    onSectorSelect?.(polygon.id);
                  },
                }}
              >
                <Popup>
                  <div className="text-sm min-w-[200px]">
                    <div className="font-bold text-base mb-2">{polygon.id}</div>
                    <div className="space-y-1">
                      <div>
                        <span className="font-semibold">Tipo:</span> {typeText}
                      </div>
                      <div>
                        <span className="font-semibold">Severidade:</span>{" "}
                        {severityText}
                      </div>
                      <div>
                        <span className="font-semibold">Coordenadas:</span>
                        <br />
                        {centerLat.toFixed(6)}, {centerLng.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-semibold">Vértices:</span>{" "}
                        {positions.length}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}

        {/* Marcador do centro da fazenda (apenas se não houver polígonos) */}
        {polygons.length === 0 && boundaryPositions.length > 0 && (
          <Marker position={mapCenter} icon={createCustomIcon("#3b82f6")}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-base mb-2">
                  Centro da Propriedade
                </div>
                <div>
                  <span className="font-semibold">Coordenadas:</span>
                  <br />
                  {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
