import { useState } from "react";
import PlaceCard from "../components/PlaceCard";
import StatusChip from "../components/StatusChip";
import { days, getPlace, getReservationFor } from "../lib/data";
import { STORE_KEYS, useStoredState } from "../lib/store";
import { madridNow } from "../lib/time";

export default function Days() {
  const now = madridNow();
  const initial =
    days.find((d) => d.date === now.date)?.id ?? days[0].id;
  const [activeId, setActiveId] = useState(initial);
  const [tired] = useStoredState<boolean>(STORE_KEYS.tired, false);
  const day = days.find((d) => d.id === activeId) ?? days[0];
  const items = day.items.filter((i) => !tired || !i.optional);

  return (
    <div>
      <h1>Все дни</h1>
      <div className="day-tabs">
        {days.map((d) => (
          <button
            key={d.id}
            className={d.id === activeId ? "active" : ""}
            onClick={() => setActiveId(d.id)}
          >
            {d.weekday}, {d.date.slice(8)}.07
          </button>
        ))}
      </div>
      <h2>
        {day.weekday}, {day.title}
      </h2>
      {tired && (
        <p className="muted">
          Спокойный режим: опциональные пункты скрыты.
        </p>
      )}
      <div className="card">
        {items.map((item) => {
          const place = getPlace(item.placeId);
          const reservation =
            item.reservation && item.placeId
              ? getReservationFor(item.placeId)
              : undefined;
          return (
            <div
              key={item.id}
              className={`timeline-item ${item.optional ? "optional" : ""}`}
            >
              <div className="timeline-time">
                {item.start}
                {item.end ? `–${item.end}` : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div className="timeline-title">
                  <strong>{item.title}</strong>{" "}
                  {item.optional && (
                    <span className="chip outline">опционально</span>
                  )}
                  {reservation && <StatusChip status={reservation.status} />}
                </div>
                {item.transportMode && (
                  <span className="muted">
                    {item.transportMode === "taxi"
                      ? "🚕 такси"
                      : item.transportMode === "flight"
                        ? "✈️"
                        : "🚶 пешком"}{" "}
                  </span>
                )}
                {item.notes.length > 0 && (
                  <details>
                    <summary className="muted">детали</summary>
                    <ul className="tight">
                      {item.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </details>
                )}
                {place && (
                  <details>
                    <summary className="muted">о месте</summary>
                    <PlaceCard place={place} />
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {day.planB && (
        <details className="card">
          <summary>План B на этот день</summary>
          <p>{day.planB}</p>
        </details>
      )}
    </div>
  );
}
