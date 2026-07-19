import GuideBlock from "../components/GuideBlock";
import { days, getDayIntro, getGuide, getPlace } from "../lib/data";
import { ttsSupported } from "../lib/tts";
import type { PlaceGuide } from "../types";

/** Все рассказы по дням: озвучка, загадки, вступление к каждому дню. */
export default function Guide() {
  return (
    <div>
      <h1>🎙️ Гид по нашей Валенсии</h1>
      <p className="muted">
        Рассказы о каждом месте в порядке маршрута — читайте вслух или
        нажимайте «Слушать»
        {ttsSupported()
          ? ": телефон озвучит текст русским голосом (на iPhone — «Милена»)."
          : "."}{" "}
        В конце каждого рассказа — загадка для всей семьи.
      </p>
      {days.map((day) => {
        const intro = getDayIntro(day.id);
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
        if (!intro && dayGuides.length === 0) return null;
        return (
          <div key={day.id}>
            <h2>
              {day.weekday}, {day.date.slice(8)}.07 — {day.title}
            </h2>
            {intro && (
              <div className="card">
                <GuideBlock guide={{ placeId: day.id, ...intro }} />
              </div>
            )}
            {dayGuides.map(({ guide, time }) => (
              <div className="card" key={guide.placeId}>
                <p className="muted" style={{ margin: "0 0 4px" }}>
                  {time} · {getPlace(guide.placeId)?.name}
                </p>
                <GuideBlock guide={guide} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
