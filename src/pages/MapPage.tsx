import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import PlaceCard from "../components/PlaceCard";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  days,
  getPlace,
  places,
  routeUrl
} from "../lib/data";
import { formatDistance, haversineMeters, walkMinutes } from "../lib/geo";
import { madridNow, toMinutes } from "../lib/time";
import type { Coordinates, Place, PlaceCategory } from "../types";

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

interface RouteStop {
  place: Place;
  start: string;
  title: string;
  order: number;
}

function pinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="marker-pin" style="width:22px;height:22px;background:${color}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });
}

function numberIcon(color: string, n: number, active: boolean): L.DivIcon {
  const size = active ? 30 : 24;
  return L.divIcon({
    className: "",
    html: `<div class="marker-num${active ? " active" : ""}" style="width:${size}px;height:${size}px;background:${color}">${n}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

/** Точки выбранного дня в порядке маршрута, без повторов подряд. */
function dayStops(dayId: string): RouteStop[] {
  const day = days.find((d) => d.id === dayId);
  if (!day) return [];
  const stops: RouteStop[] = [];
  for (const item of day.items) {
    const place = getPlace(item.placeId);
    if (!place) continue;
    if (stops.length > 0 && stops[stops.length - 1].place.id === place.id)
      continue;
    stops.push({ place, start: item.start, title: item.title, order: stops.length + 1 });
  }
  return stops;
}

export default function MapPage() {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const geoLayerRef = useRef<L.LayerGroup | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const now = madridNow();
  const todayId = days.find((d) => d.date === now.date)?.id;
  const [mode, setMode] = useState<string>(todayId ?? "all");
  const [pos, setPos] = useState<Coordinates | null>(null);
  const [watching, setWatching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const stops = useMemo(() => (mode === "all" ? [] : dayStops(mode)), [mode]);

  // Следующая точка маршрута: первая, чьё время ещё не прошло (для сегодня),
  // иначе — первая точка дня.
  const nextStop = useMemo(() => {
    if (stops.length === 0) return null;
    if (mode === todayId) {
      return stops.find((s) => toMinutes(s.start) >= now.minutes - 15) ?? stops[stops.length - 1];
    }
    return stops[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, mode, todayId]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [39.4715, -0.3724],
      zoom: 14
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    geoLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Перерисовка точек при смене режима.
  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    if (mode === "all") {
      for (const place of places) {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lon], {
          icon: pinIcon(CATEGORY_COLORS[place.category]),
          title: place.name
        });
        marker.on("click", () => setSelected(place));
        layer.addLayer(marker);
      }
    } else {
      const latlngs: [number, number][] = stops.map((s) => [
        s.place.coordinates.lat,
        s.place.coordinates.lon
      ]);
      if (latlngs.length > 1) {
        layer.addLayer(
          L.polyline(latlngs, {
            color: "#e8590c",
            weight: 3,
            dashArray: "6 8",
            opacity: 0.8
          })
        );
      }
      for (const s of stops) {
        const active = nextStop?.order === s.order;
        const marker = L.marker(
          [s.place.coordinates.lat, s.place.coordinates.lon],
          {
            icon: numberIcon(CATEGORY_COLORS[s.place.category], s.order, active),
            title: s.place.name,
            zIndexOffset: active ? 500 : 0
          }
        );
        marker.on("click", () => setSelected(s.place));
        layer.addLayer(marker);
      }
      if (latlngs.length > 0)
        map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
    }
  }, [mode, stops, nextStop]);

  // Живая точка «я здесь».
  const toggleWatch = () => {
    if (watching) {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      geoLayerRef.current?.clearLayers();
      setPos(null);
      setWatching(false);
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeoError("Геолокация не поддерживается этим браузером.");
      return;
    }
    setGeoError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (event) => {
        const p = { lat: event.coords.latitude, lon: event.coords.longitude };
        setPos(p);
        const layer = geoLayerRef.current;
        if (layer) {
          layer.clearLayers();
          layer.addLayer(
            L.circle([p.lat, p.lon], {
              radius: event.coords.accuracy,
              color: "#1971c2",
              weight: 1,
              fillOpacity: 0.1
            })
          );
          layer.addLayer(
            L.circleMarker([p.lat, p.lon], {
              radius: 8,
              color: "#fff",
              weight: 2,
              fillColor: "#1971c2",
              fillOpacity: 1
            })
          );
        }
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Доступ к геолокации запрещён. Разрешите его в настройках браузера."
            : "Не удалось определить местоположение."
        );
        setWatching(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    setWatching(true);
  };

  const distance =
    pos && nextStop ? haversineMeters(pos, nextStop.place.coordinates) : null;

  return (
    <>
      <div className="map-wrap" ref={containerRef} />
      <div className="map-topbar">
        <div className="day-tabs" style={{ padding: 0 }}>
          <button
            className={mode === "all" ? "active" : ""}
            onClick={() => setMode("all")}
          >
            Все точки
          </button>
          {days.map((d) => (
            <button
              key={d.id}
              className={mode === d.id ? "active" : ""}
              onClick={() => setMode(d.id)}
            >
              {d.weekday.slice(0, 2)} {d.date.slice(8)}.07
            </button>
          ))}
        </div>
      </div>
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
      <button
        className={`geo-btn ${watching ? "on" : ""}`}
        onClick={toggleWatch}
        title="Показать меня на карте"
      >
        📍
      </button>
      {(mode !== "all" || geoError) && !selected && (
        <div className="route-panel">
          {geoError && <p className="muted">{geoError}</p>}
          {nextStop ? (
            <>
              <p style={{ margin: 0 }}>
                <span className="muted">
                  Точка {nextStop.order} из {stops.length} · {nextStop.start}
                </span>
                <br />
                <strong>{nextStop.title}</strong>
                {distance !== null && (
                  <>
                    {" — "}
                    {formatDistance(distance)} по прямой (~
                    {walkMinutes(distance)} мин пешком)
                  </>
                )}
              </p>
              <div className="btn-row" style={{ marginTop: 8 }}>
                <a
                  className="big-btn"
                  style={{ margin: 0, padding: 10 }}
                  href={routeUrl(nextStop.place)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Навигация
                </a>
                <button
                  className="big-btn secondary"
                  style={{ margin: 0, padding: 10 }}
                  onClick={() => setSelected(nextStop.place)}
                >
                  О точке
                </button>
              </div>
              {!watching && (
                <p className="muted" style={{ marginBottom: 0 }}>
                  Нажмите 📍, чтобы видеть себя на карте и расстояние до точки.
                </p>
              )}
            </>
          ) : (
            <p style={{ margin: 0 }}>На этот день точек нет.</p>
          )}
        </div>
      )}
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
