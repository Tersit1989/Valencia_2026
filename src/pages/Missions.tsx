import { days, getPlace, stories } from "../lib/data";
import { STORE_KEYS, useStoredState } from "../lib/store";

export default function Missions() {
  const [done, setDone] = useStoredState<string[]>(STORE_KEYS.missions, []);

  const toggle = (id: string) =>
    setDone(done.includes(id) ? done.filter((x) => x !== id) : [...done, id]);

  const pct = Math.round((done.length / stories.length) * 100);

  return (
    <div>
      <h1>🦇 Детские миссии</h1>
      <p>
        Собрано значков: <strong>{done.length}</strong> из {stories.length}
      </p>
      <div className="progress">
        <div style={{ width: `${pct}%` }} />
      </div>
      {done.length === stories.length && (
        <p className="banner">🎉 Все значки собраны! Ты — настоящий исследователь Валенсии!</p>
      )}
      {days.map((day) => {
        const dayStories = stories.filter((s) => s.dayId === day.id);
        if (dayStories.length === 0) return null;
        return (
          <div key={day.id}>
            <h2>
              {day.weekday}: {day.title}
            </h2>
            {dayStories.map((s) => {
              const isDone = done.includes(s.id);
              const place = getPlace(s.placeId);
              return (
                <div
                  key={s.id}
                  className={`card mission-card ${isDone ? "done" : ""}`}
                >
                  <div className="mission-badge">{s.badge}</div>
                  <div style={{ flex: 1 }}>
                    <h3>{s.title}</h3>
                    {place && <p className="muted">📍 {place.name}</p>}
                    <p>{s.story}</p>
                    <p>
                      ❓ <em>{s.question}</em>
                    </p>
                    <p>
                      🎯 <strong>Миссия:</strong> {s.mission}
                    </p>
                    <button
                      className={`big-btn ${isDone ? "active" : "secondary"}`}
                      onClick={() => toggle(s.id)}
                    >
                      {isDone ? "✅ Выполнено! Значок твой" : "Выполнить миссию"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
