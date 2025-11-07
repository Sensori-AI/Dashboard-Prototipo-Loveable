import * as turf from "@turf/turf";

export function centroid(polygon: [number, number][]): [number, number] {
  const centroid = turf.centroid(
    turf.polygon([polygon.map(([lat, lon]) => [lon, lat])])
  );

  return centroid.geometry.coordinates as [number, number];
}

export function areaHa(polygon: [number, number][]): string {
  const turfPoly = turf.polygon([polygon.map(([lat, lon]) => [lon, lat])]);

  return (turf.area(turfPoly) / 10000).toFixed(2);
}

export function center(polygon: [number, number][]): [number, number] {
  return [
    polygon.reduce((sum, [lat]) => sum + lat, 0) / polygon.length,
    polygon.reduce((sum, [, lon]) => sum + lon, 0) / polygon.length,
  ];
}
