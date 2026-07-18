import { useState } from "react";
import TtsButton from "../components/TtsButton";
import { days, getDayIntro, getGuide, getPlace } from "../lib/data";
import { ttsSupported } from "../lib/tts";
import type { PlaceGuide } from "../types";

function QuestionCard({ guide }: { guide: PlaceGuide }) {
  const [revealed, setRevealed] = useState(false);
  if (!guide.question || !guide.answer) return null;
  return (
    <div className="quiz">
      <p className="quiz-q">❓ {guide.question}</p>
      {revealed ? (
        <p className="quiz-a">💡 {guide.answer}</p>
      ) : (
        <button className="quiz-btn" onClick={() => setRevealed(true)}>
          Показать ответ
        </button>
      )}
    </div>
  );
}

function GuideCard({
  guide,
  time,
  placeName
}: {
  guide: PlaceGuide;
  time?: string;
  placeName?: string;
}) {
  const speechText = `${guide.title}. ${guide.paragraphs.join(" ")}`;
  return (
    <div className="card">
      {(time || placeName) && (
        <p className="muted" style={{ margin: 0 }}>
          {[time, placeName].filter(Boolean).join(" · ")}
        </p>
      )}
      <div className="guide-head">
        <h3 style={{ marginTop: 4 }}>{guide.title}</h3>
        <TtsButton text={speechText} />
      </div>
      {guide.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="guide-text">
          {p}
        </p>
      ))}
      <QuestionCard guide={guide} />
    </div>
  );
}

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
              <GuideCard
                guide={{ placeId: day.id, ...intro }}
              />
            )}
            {dayGuides.map(({ guide, time }) => (
              <GuideCard
                key={guide.placeId}
                guide={guide}
                time={time}
                placeName={getPlace(guide.placeId)?.name}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
