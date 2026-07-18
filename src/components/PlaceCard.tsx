import type { Place } from "../types";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getGuide,
  getPlace,
  routeUrl
} from "../lib/data";
import StatusChip from "./StatusChip";
import TtsButton from "./TtsButton";

/** Full point card per the map spec: name, day/time, status, address, route,
 *  meaning, facts, order, avoid, child mission, plan B, official site. */
export default function PlaceCard({ place }: { place: Place }) {
  const prev = getPlace(place.previousPlaceId);
  const guide = getGuide(place.id);
  return (
    <div>
      <h3>{place.name}</h3>
      <div>
        <span
          className="chip"
          style={{ background: CATEGORY_COLORS[place.category] }}
        >
          {CATEGORY_LABELS[place.category]}
        </span>
        <StatusChip status={place.reservationStatus} />
        {place.verificationStatus === "verify" && (
          <span className="chip outline">⚠ проверить перед поездкой</span>
        )}
      </div>
      {(place.date || place.time) && (
        <p className="muted">
          {place.date} {place.time}
          {place.duration ? ` · ${place.duration}` : ""}
        </p>
      )}
      <p className="muted">📍 {place.address}</p>
      {(place.transportMode || prev) && (
        <p className="muted">
          {place.transportMode === "taxi" ? "🚕 Такси" : "🚶 Пешком"}
          {prev ? ` от «${prev.name}»` : ""}
        </p>
      )}
      {place.routeNotes && <p className="guide-text">{place.routeNotes}</p>}
      {guide && (
        <div className="guide-block">
          <div className="guide-head">
            <p className="guide-title">🎙️ {guide.title}</p>
            <TtsButton text={`${guide.title}. ${guide.paragraphs.join(" ")}`} />
          </div>
          {guide.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="guide-text">
              {p}
            </p>
          ))}
        </div>
      )}
      {place.facts.length > 0 && (
        <details open>
          <summary>Интересное</summary>
          <ul className="tight">
            {place.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      )}
      {place.foodRecommendations.length > 0 && (
        <details>
          <summary>Что заказать / посмотреть</summary>
          <ul className="tight">
            {place.foodRecommendations.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      )}
      {place.wineRecommendations.length > 0 && (
        <details>
          <summary>Вино</summary>
          <ul className="tight">
            {place.wineRecommendations.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      )}
      {place.childOptions.length > 0 && (
        <details>
          <summary>Ребёнку</summary>
          <ul className="tight">
            {place.childOptions.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      )}
      {place.etiquette.length > 0 && (
        <details>
          <summary>Как принято</summary>
          <ul className="tight">
            {place.etiquette.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      )}
      {place.childMission && (
        <p>
          🦇 <strong>Детская миссия:</strong> {place.childMission}
        </p>
      )}
      {place.planB && (
        <details>
          <summary>План B</summary>
          <p>{place.planB}</p>
        </details>
      )}
      <div className="btn-row" style={{ marginTop: 10 }}>
        <a
          className="big-btn"
          href={routeUrl(place)}
          target="_blank"
          rel="noreferrer"
        >
          Открыть маршрут
        </a>
        {place.officialUrl ? (
          <a
            className="big-btn secondary"
            href={place.officialUrl}
            target="_blank"
            rel="noreferrer"
          >
            Официальный сайт
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
