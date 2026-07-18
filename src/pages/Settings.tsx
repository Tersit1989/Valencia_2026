import { Link } from "react-router-dom";
import { days, trip } from "../lib/data";
import { STORE_KEYS, useStoredState } from "../lib/store";

export default function Settings() {
  const [theme, setTheme] = useStoredState<string>(STORE_KEYS.theme, "auto");
  const [simulateDate, setSimulateDate] = useStoredState<string>(
    STORE_KEYS.simulateDate,
    ""
  );
  const [tired, setTired] = useStoredState<boolean>(STORE_KEYS.tired, false);
  const [, setMissions] = useStoredState<string[]>(STORE_KEYS.missions, []);

  return (
    <div>
      <h1>Ещё</h1>

      <div className="btn-row">
        <Link className="big-btn secondary" to="/phrases">
          🗣️ Фразы
        </Link>
        <Link className="big-btn secondary" to="/emergency">
          🚨 Экстренное
        </Link>
      </div>

      <h2>Настройки</h2>
      <div className="card">
        <label className="field">
          Тема
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="auto">Как в системе</option>
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </label>
        <label className="field">
          Показывать день (для подготовки)
          <select
            value={simulateDate}
            onChange={(e) => setSimulateDate(e.target.value)}
          >
            <option value="">Автоматически (по дате)</option>
            {days.map((d) => (
              <option key={d.id} value={d.date}>
                {d.weekday}, {d.date}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <input
            type="checkbox"
            checked={tired}
            onChange={(e) => setTired(e.target.checked)}
          />{" "}
          Спокойный режим («Мы устали»)
        </label>
        <button className="big-btn secondary" onClick={() => setMissions([])}>
          Сбросить прогресс детских миссий
        </button>
      </div>

      <h2>Чек-лист перед поездкой</h2>
      <div className="card">
        <ul className="tight">
          {trip.checklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <h2>Правила поездки</h2>
      <div className="card">
        <ul className="tight">
          {trip.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <h2>Проверить перед поездкой (источники)</h2>
      <div className="card">
        <ul className="tight">
          {trip.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="muted">
        Данные: {trip.version}. Приложение работает офлайн после первого
        открытия; карта офлайн показывает уже просмотренные участки.
      </p>
    </div>
  );
}
