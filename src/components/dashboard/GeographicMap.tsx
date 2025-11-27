// src/components/dashboard/GeographicMap.tsx
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";

type PolygonItem = {
  id: string;
  coordinates: { lat: number; lng: number }[];
  type: "weed" | "failure" | "user" | "other";
  severity?: "high" | "medium" | "low";
  name?: string;
};

interface GeographicMapProps {
  polygons: PolygonItem[];
  selectedSectorId?: string | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number | string;
}

/* ---------- Leaflet default icon fix (use once) ---------- */
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete (L.Icon.Default as any).prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    // using require allows bundlers to include the images
    // if your project uses Vite with asset handling, these will resolve
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
} catch (e) {
  // ignore in environments where require isn't available at runtime
}

/* ---------- Geometry helpers (no external libs) ---------- */
function lonLatToXY(lon: number, lat: number, lat0Rad: number) {
  const R = 6371000; // meters
  const x = (lon * Math.PI / 180) * R * Math.cos(lat0Rad);
  const y = (lat * Math.PI / 180) * R;
  return [x, y] as [number, number];
}

function calcAreaAndCentroid(lonlatCoords: [number, number][]) {
  if (lonlatCoords.length < 3) return { area_m2: 0, centroid: { lat: 0, lng: 0 } };

  // lat média para projeção local
  const lats = lonlatCoords.map(c => c[1]);
  const lat0 = lats.reduce((a, b) => a + b, 0) / lats.length;
  const lat0Rad = (lat0 * Math.PI) / 180;

  // converte p/ xy (metros)
  const xy = lonlatCoords.map(([lon, lat]) => lonLatToXY(lon, lat, lat0Rad));

  // garante fechamento
  if (xy.length > 0) {
    const first = xy[0];
    const last = xy[xy.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) xy.push(first);
  }

  // shoelace para área e centróide em XY
  let A = 0;
  let Cx = 0;
  let Cy = 0;
  for (let i = 0; i < xy.length - 1; i++) {
    const [x0, y0] = xy[i];
    const [x1, y1] = xy[i + 1];
    const cross = x0 * y1 - x1 * y0;
    A += cross;
    Cx += (x0 + x1) * cross;
    Cy += (y0 + y1) * cross;
  }
  A = A / 2;
  const area_m2 = Math.abs(A);

  let centroidX = 0;
  let centroidY = 0;
  if (Math.abs(A) > 1e-9) {
    centroidX = Cx / (6 * A);
    centroidY = Cy / (6 * A);
  } else {
    // fallback: média
    const n = xy.length - 1;
    centroidX = xy.slice(0, n).reduce((s, v) => s + v[0], 0) / n;
    centroidY = xy.slice(0, n).reduce((s, v) => s + v[1], 0) / n;
  }

  // volta para lon/lat aproximado
  const R = 6371000;
  const lonRad = centroidX / (R * Math.cos(lat0Rad));
  const latRad = centroidY / R;
  const centroidLng = (lonRad * 180) / Math.PI;
  const centroidLat = (latRad * 180) / Math.PI;

  return { area_m2, centroid: { lat: centroidLat, lng: centroidLng } };
}

/* ---------- Fit bounds helper component ---------- */
function FitBounds({ polygons, selectedId }: { polygons: PolygonItem[]; selectedId?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const latlngs = polygons.flatMap(p => p.coordinates.map(c => [c.lat, c.lng] as [number, number]));
    if (latlngs.length === 0) return;

    if (selectedId) {
      const sel = polygons.find(p => p.id === selectedId);
      if (sel && sel.coordinates.length > 0) {
        const selLatLngs = sel.coordinates.map(c => [c.lat, c.lng] as [number, number]);
        map.fitBounds(selLatLngs, { padding: [40, 40], maxZoom: 19 });
        return;
      }
    }

    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, polygons, selectedId]);

  return null;
}

/* ---------- Component ---------- */
export const GeographicMap: React.FC<GeographicMapProps> = ({
  polygons,
  selectedSectorId = null,
  center,
  zoom = 15,
  height = "420px",
}) => {
  // Enriquecer polígonos com área e centróide (memoizado)
  const enriched = useMemo(() => {
    return polygons.map(p => {
      const coordsLngLat: [number, number][] = p.coordinates.map(c => [c.lng, c.lat]);
      if (coordsLngLat.length > 0) {
        const first = coordsLngLat[0];
        const last = coordsLngLat[coordsLngLat.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) coordsLngLat.push(first);
      }
      const { area_m2, centroid } = calcAreaAndCentroid(coordsLngLat);
      return {
        ...p,
        _area_m2: area_m2,
        _area_ha: area_m2 / 10000,
        _centroid: centroid,
      } as PolygonItem & { _area_m2: number; _area_ha: number; _centroid: { lat: number; lng: number } };
    });
  }, [polygons]);

  const initialCenter = center ?? (enriched[0]?._centroid ?? { lat: 0, lng: 0 });

  /* ---------- popup automático no centróide do primeiro polígono (ou do selecionado) ---------- */
  function AutoPopup() {
    const map = useMap();

    useEffect(() => {
      if (!map) return;
      const target = selectedSectorId ? enriched.find(p => p.id === selectedSectorId) : enriched[0];
      if (!target) return;
      const c = (target as any)._centroid;
      const areaHa = ((target as any)._area_ha ?? 0).toFixed(4);
      const content = `<div style="min-width:160px"><strong>${target.name ?? target.id}</strong><div>Área: ${areaHa} ha</div><div>Lat: ${c.lat.toFixed(6)}</div><div>Lng: ${c.lng.toFixed(6)}</div></div>`;
      L.popup({ maxWidth: 300, closeButton: true })
        .setLatLng([c.lat, c.lng])
        .setContent(content)
        .openOn(map);
    }, [map, enriched, selectedSectorId]);

    return null;
  }

  // estilo simples por tipo/severidade
  const styleFor = (p: PolygonItem) => {
    if (p.type === "user") return { color: "#1f78b4", fillColor: "#1f78b420", weight: p.id === selectedSectorId ? 3 : 2 };
    if (p.type === "weed") {
      if (p.severity === "high") return { color: "#e11d48", fillColor: "#e11d4822", weight: p.id === selectedSectorId ? 3 : 2 };
      if (p.severity === "medium") return { color: "#f59e0b", fillColor: "#f59e0b22", weight: p.id === selectedSectorId ? 3 : 2 };
      return { color: "#10b981", fillColor: "#10b98122", weight: p.id === selectedSectorId ? 3 : 2 };
    }
    if (p.type === "failure") return { color: "#9333ea", fillColor: "#9333ea22", weight: p.id === selectedSectorId ? 3 : 2 };
    return { color: "#374151", fillColor: "#37415122", weight: p.id === selectedSectorId ? 3 : 2 };
  };

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer center={[initialCenter.lat, initialCenter.lng]} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        {/* SATÉLITE - Esri World Imagery */}
        <TileLayer
          attribution='Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Caso tiles do Esri falhem, troque pela URL abaixo (OSM): */}
        {/*
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        */}

        <FitBounds polygons={polygons} selectedId={selectedSectorId} />
        <AutoPopup />

        {enriched.map(p => {
          const latlngs = p.coordinates.map(c => [c.lat, c.lng] as [number, number]);
          const style = styleFor(p);
          return (
            <Polygon key={p.id} pathOptions={style} positions={latlngs}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>{p.name ?? p.id}</strong>
                  <div>Tipo: {p.type}</div>
                  {p.severity && <div>Severidade: {p.severity}</div>}
                  <div>Área: {(p as any)._area_ha?.toFixed(4)} ha</div>
                  <div>Centro: {(p as any)._centroid?.lat.toFixed(6)}, {(p as any)._centroid?.lng.toFixed(6)}</div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* marcador visual no centróide do setor selecionado */}
        {selectedSectorId &&
          (() => {
            const sel = enriched.find(p => p.id === selectedSectorId);
            if (!sel) return null;
            const c = (sel as any)._centroid;
            return <CircleMarker key={`cent-${sel.id}`} center={[c.lat, c.lng]} radius={8} pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e980" }} />;
          })()}
      </MapContainer>
    </div>
  );
};

export default GeographicMap;
