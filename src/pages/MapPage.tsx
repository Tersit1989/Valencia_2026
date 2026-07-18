import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import PlaceCard from "../components/PlaceCard";
import { CATEGORY_COLORS, CATEGORY_LABELS, places } from "../lib/data";
import type { Place, PlaceCategory } from "../types";

const LEGEND: PlaceCategory[] = [
  "hotel",
  "confirmed-restaurant",
  "pending-restaurant",
  "candidate-restaurant",
  "attraction",
  "optional-attraction",
  "fallback-food",
  "transport",
  "emergency"
];

function pinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="marker-pin" style="width:22px;height:22px;background:${color}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });
}

export default function MapPage() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [39.4715, -0.3724],
      zoom: 14,
      zoomControl: true
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    for (const place of places) {
      const marker = L.marker(
        [place.coordinates.lat, place.coordinates.lon],
        { icon: pinIcon(CATEGORY_COLORS[place.category]), title: place.name }
      ).addTo(map);
      marker.on("click", () => setSelected(place));
    }
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <div className="map-wrap" ref={containerRef} />
      <div className="map-legend">
        <div
          onClick={() => setLegendOpen((v) => !v)}
          style={{ fontWeight: 700, cursor: "pointer" }}
        >
          Легенда {legendOpen ? "▴" : "▾"}
        </div>
        {legendOpen &&
          LEGEND.map((c) => (
            <div key={c}>
              <span className="dot" style={{ background: CATEGORY_COLORS[c] }} />
              {CATEGORY_LABELS[c]}
            </div>
          ))}
      </div>
      {selected && (
        <div className="sheet">
          <button className="sheet-close" onClick={() => setSelected(null)}>
            ✕
          </button>
          <PlaceCard place={selected} />
        </div>
      )}
    </>
  );
}
