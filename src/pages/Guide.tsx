import { days, getGuide, getPlace } from "../lib/data";
import type { PlaceGuide } from "../types";

/** Все рассказы по дням — крупным текстом, удобно читать вслух на камеру. */
export default function Guide() {
  return (
    <div>
      <h1>🎙️ Гид для видео</h1>
      <p className="muted">
        Короткие рассказы о каждом месте — в порядке маршрута. Открывайте на
        месте и читайте вслух.
      </p>
      {days.map((day) => {
        const seen = new Set<string>();
        const dayGuides: { guide: PlaceGuide; time: string }[] = [];
        for (const item of day.items) {
          if (!item.placeId || seen.has(item.placeId)) continue;
          const guide = getGuide(item.placeId);
          if (guide) {
            seen.add(item.placeId);
            dayGuides.push({ guide, time: item.start });
          }
        }
        if (dayGuides.length === 0) return null;
        return (
          <div key={day.id}>
            <h2>
              {day.weekday}, {day.date.slice(8)}.07 — {day.title}
            </h2>
            {dayGuides.map(({ guide, time }) => {
              const place = getPlace(guide.placeId);
              return (
                <div className="card" key={guide.placeId}>
                  <p className="muted" style={{ margin: 0 }}>
                    {time} · {place?.name}
                  </p>
                  <h3 style={{ marginTop: 4 }}>{guide.title}</h3>
                  {guide.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="guide-text">
                      {p}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
