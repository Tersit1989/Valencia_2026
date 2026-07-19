import type { Coordinates } from "../types";

/** Расстояние по прямой между двумя точками, в метрах (формула гаверсинусов). */
export function haversineMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(meters: number): string {
  if (meters < 950) return `${Math.round(meters / 10) * 10} м`;
  return `${(meters / 1000).toFixed(1)} км`;
}

/** Пешком ~4,5 км/ч с учётом светофоров. */
export function walkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 75));
}
