import { useEffect, useState } from "react";
import { speak, stopSpeaking, ttsSupported, warmUpVoices } from "../lib/tts";

/** Кнопка «Слушать»: озвучивает текст системным русским голосом. */
export default function TtsButton({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    warmUpVoices();
    return () => {
      if (playing) stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ttsSupported()) return null;

  const toggle = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      speak(text, () => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <button className={`tts-btn ${playing ? "playing" : ""}`} onClick={toggle}>
      {playing ? "⏹ Остановить" : "▶︎ Слушать"}
    </button>
  );
}
