import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FoodPanel from "../components/FoodPanel";
import GuideBlock from "../components/GuideBlock";
import PlaceCard from "../components/PlaceCard";
import StatusChip from "../components/StatusChip";
import { getGuide, getPlace, getReservationFor, routeUrl, trip } from "../lib/data";
import { STORE_KEYS, useStoredState } from "../lib/store";
import {
  computeNowState,
  findDayByDate,
  formatMinutesLeft,
  madridNow
} from "../lib/time";
import type { ItineraryItem } from "../types";

function ItemCard({
  item,
  label,
  minutesToNext
}: {
  item: ItineraryItem;
  label: string;
  minutesToNext?: number;
}) {
  const place = getPlace(item.placeId);
  const reservation = item.placeId ? getReservationFor(item.placeId) : undefined;
  return (
    <div className="card">
      <p className="muted" style={{ margin: 0 }}>
        {label}
      </p>
      <h3 style={{ marginTop: 4 }}>
        {item.start}
        {item.end ? `–${item.end}` : ""} · {item.title}
      </h3>
      {minutesToNext !== undefined && (
        <p>
          ⏰ Выходить <strong>{formatMinutesLeft(minutesToNext)}</strong>
        </p>
      )}
      {item.transportMode && (
        <p className="muted">
          {item.transportMode === "taxi"
            ? "🚕 Такси"
            : item.transportMode === "flight"
              ? "✈️ Самолёт"
              : "🚶 Пешком"}
        </p>
      )}
      {reservation && item.reservation && (
        <p>
          Бронь: <StatusChip status={reservation.status} />
          <span className="muted">
            {reservation.time}, {reservation.partySize} чел.
          </span>
        </p>
      )}
      {item.notes.length > 0 && (
        <ul className="tight">
          {item.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      {place && (
        <details>
          <summary>Подробнее о месте</summary>
          <PlaceCard place={place} hideGuide />
        </details>
      )}
      {place && getGuide(place.id) && (
        <details>
          <summary>🎙️ Гид</summary>
          <GuideBlock guide={getGuide(place.id)!} />
        </details>
      )}
      {place && (
        <a className="big-btn" href={routeUrl(place)} target="_blank" rel="noreferrer">
          Открыть маршрут
        </a>
      )}
    </div>
  );
}

export default function Today() {
  const [tired, setTired] = useStoredState<boolean>(STORE_KEYS.tired, false);
  const [simulateDate] = useStoredState<string>(STORE_KEYS.simulateDate, "");
  const [showFood, setShowFood] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => forceTick((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const now = madridNow();
  const date = simulateDate || now.date;
  const state = computeNowState(date, now.minutes, tired);
  const day = state.day ?? findDayByDate(trip.trip.startDate);

  return (
    <div>
      <h1>
        {state.phase === "before-trip" && "До поездки"}
        {state.phase === "after-trip" && "Поездка завершена"}
        {state.phase === "trip" &&
          `${state.day?.weekday}, ${state.day?.title ?? ""}`}
      </h1>
      {simulateDate && (
        <p className="banner">
          Режим просмотра дня {simulateDate}.{" "}
          <Link to="/more">Отключить в настройках</Link>
        </p>
      )}
      {state.phase === "before-trip" && (
        <div className="card">
          <h3>Валенсия, 22–26 июля 2026</h3>
          <p>
            {trip.trip.group}. Отель: {trip.trip.hotel.name},{" "}
            {trip.trip.hotel.address}.
          </p>
          <p className="muted">
            До вылета всё по плану. Проверь чек-лист на странице «Ещё».
          </p>
          <Link className="big-btn" to="/days">
            Посмотреть программу
          </Link>
        </div>
      )}
      {state.phase === "after-trip" && (
        <div className="card">
          <p>Надеемся, поездка удалась! 🦇🍊</p>
        </div>
      )}
      {state.phase === "trip" && (
        <>
          {tired && (
            <div className="banner">
              😌 Спокойный режим: опциональные пункты скрыты. Такси вместо
              пешком — это нормально. Ближайший отдых — отель{" "}
              {trip.trip.hotel.name}. День всё равно удался.
            </div>
          )}
          {state.current && (
            <ItemCard item={state.current} label="Сейчас" />
          )}
          {state.next && (
            <ItemCard
              item={state.next}
              label="Дальше"
              minutesToNext={state.minutesToNext}
            />
          )}
          {!state.current && !state.next && (
            <div className="card">
              <p>На сегодня программа выполнена. Отдыхайте!</p>
            </div>
          )}
          <div className="btn-row">
            <button
              className={`big-btn secondary ${tired ? "active" : ""}`}
              onClick={() => setTired(!tired)}
            >
              {tired ? "✅ Мы устали" : "😮‍💨 Мы устали"}
            </button>
            <button
              className="big-btn secondary"
              onClick={() => setShowFood((v) => !v)}
            >
              🍽️ Нужна еда
            </button>
          </div>
          {showFood && <FoodPanel date={date} />}
          {day?.planB && (
            <details className="card">
              <summary>План B на этот день</summary>
              <p>{day.planB}</p>
            </details>
          )}
        </>
      )}
    </div>
  );
}
