/** Озвучка через встроенный синтезатор речи (Web Speech API).
 *  На iPhone используется системный русский голос (обычно «Милена»),
 *  на Android — голос Google. Работает без API-ключей и интернета. */

let warmedUp = false;

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// iOS/Chrome загружают список голосов асинхронно — прогреваем заранее.
export function warmUpVoices(): void {
  if (!ttsSupported() || warmedUp) return;
  warmedUp = true;
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener?.("voiceschanged", () => {
    speechSynthesis.getVoices();
  });
}

function pickRussianVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const ru = voices.filter((v) => v.lang.toLowerCase().startsWith("ru"));
  return (
    ru.find((v) => /milena|милена/i.test(v.name)) ??
    ru.find((v) => /premium|enhanced|natural/i.test(v.name)) ??
    ru.find((v) => v.localService) ??
    ru[0]
  );
}

export function speak(text: string, onEnd: () => void): void {
  if (!ttsSupported()) return;
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickRussianVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "ru-RU";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (!ttsSupported()) return;
  speechSynthesis.cancel();
}
