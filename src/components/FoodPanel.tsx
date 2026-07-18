import { getPlace, reservations, routeUrl, trip } from "../lib/data";
import { madridNow, toMinutes } from "../lib/time";
import StatusChip from "./StatusChip";

/** «Нужна еда»: следующая бронь, страховка Helen Berger, panadería, продукты. */
export default function FoodPanel({ date }: { date: string }) {
  const now = madridNow();
  const upcoming = reservations
    .filter((r) => r.date > date || (r.date === date && toMinutes(r.time) >= now.minutes))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const helen = getPlace("hotel-helen-berger")!;

  return (
    <div className="card">
      <h3>🍽️ Нужна еда — без паники</h3>
      {upcoming ? (
        <p>
          Следующая бронь: <strong>{upcoming.place}</strong>,{" "}
          {upcoming.date === date ? "сегодня" : upcoming.date} в {upcoming.time}{" "}
          <StatusChip status={upcoming.status} />
          <br />
          <span className="muted">
            Если до неё далеко — перекусить легко, не наедаться.
          </span>
        </p>
      ) : (
        <p className="muted">Броней впереди нет.</p>
      )}
      <p>
        <strong>Helen Berger</strong> — страховка прямо в отеле, кухня
        non-stop: салат, titaina coca, лёгкая рыба, sandwich на двоих; ребёнку
        — tortilla, хлеб, сок.{" "}
        <a href={routeUrl(helen)} target="_blank" rel="noreferrer">
          маршрут
        </a>
      </p>
      <p>
        <strong>Panadería рядом</strong>: empanada, bocadillo, coca, выпечка,
        йогурт, фрукты. Не отправлять всю семью — сходит один.
      </p>
      <p>
        <strong>Продукты в номер</strong>: {trip.roomFood.join(", ")}.
      </p>
      <p>
        <strong>Ребёнку просто</strong>: {trip.kidSimpleFood.join("; ")}.
      </p>
    </div>
  );
}
