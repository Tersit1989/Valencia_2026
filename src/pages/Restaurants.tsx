import PlaceCard from "../components/PlaceCard";
import StatusChip from "../components/StatusChip";
import { getPlace, restaurants, trip } from "../lib/data";
import type { DishGroup } from "../types";

export default function Restaurants() {
  return (
    <div>
      <h1>Рестораны и еда</h1>
      <p className="muted">
        Главный приём пищи — обед 13:00–13:30. Вечером — лёгкая еда
        (исключение: тапас-ужин в день прилёта).
      </p>
      {restaurants.map((r) => {
        const place = getPlace(r.placeId);
        return (
          <div className="card" key={r.placeId + r.name}>
            <h3>{r.name}</h3>
            <div>
              <StatusChip status={r.status} />
              {r.date && (
                <span className="chip outline">
                  {r.date} {r.time} · {r.partySize} чел.
                </span>
              )}
            </div>
            <p>{r.role}</p>
            {r.why.length > 0 && (
              <details>
                <summary>Почему подходит</summary>
                <ul className="tight">
                  {r.why.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </details>
            )}
            {r.orderPlan.length > 0 && (
              <details>
                <summary>Что заказать</summary>
                <ul className="tight">
                  {r.orderPlan.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </details>
            )}
            {r.avoid.length > 0 && (
              <details>
                <summary>Чего избегать</summary>
                <ul className="tight">
                  {r.avoid.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </details>
            )}
            {r.phrases.length > 0 && (
              <details>
                <summary>Фразы</summary>
                {r.phrases.map((p) => (
                  <p key={p.text}>
                    <span className="muted">{p.for}: </span>
                    <em>«{p.text}»</em>
                  </p>
                ))}
              </details>
            )}
            {r.etiquette.length > 0 && (
              <details>
                <summary>Как принято</summary>
                <ul className="tight">
                  {r.etiquette.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </details>
            )}
            {r.planB && (
              <details>
                <summary>План B</summary>
                <p>{r.planB}</p>
              </details>
            )}
            {place && (
              <details>
                <summary>Адрес и маршрут</summary>
                <PlaceCard place={place} />
              </details>
            )}
          </div>
        );
      })}

      <h2>Основные испанские блюда</h2>
      {(trip.spanishDishes as DishGroup[]).map((dg) => (
        <div className="card" key={dg.group}>
          <h3>{dg.group}</h3>
          <ul className="tight">
            {dg.items.map((d) => (
              <li key={d.name}>
                <strong>{d.name}</strong> — {d.desc}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Не рассматриваем</h2>
      <div className="card">
        <p className="muted">
          Эти места исключены из плана — не предлагать и не бронировать:
        </p>
        <p>{trip.excludedRestaurants.join(" · ")}</p>
      </div>
    </div>
  );
}
