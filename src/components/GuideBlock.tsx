import { useState } from "react";
import type { PlaceGuide } from "../types";
import TtsButton from "./TtsButton";

/** Рассказ гида: заголовок, озвучка, абзацы и загадка для семьи. */
export default function GuideBlock({ guide }: { guide: PlaceGuide }) {
  const [revealed, setRevealed] = useState(false);
  const speechText = `${guide.title}. ${guide.paragraphs.join(" ")}`;
  return (
    <div>
      <div className="guide-head">
        <p className="guide-title">🎙️ {guide.title}</p>
        <TtsButton text={speechText} />
      </div>
      {guide.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="guide-text">
          {p}
        </p>
      ))}
      {guide.question && guide.answer && (
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
      )}
    </div>
  );
}
