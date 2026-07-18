import { useState } from "react";
import { phraseGroups } from "../lib/data";

export default function Phrases() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // клипборд недоступен (например, офлайн-режим iOS) — фраза всё равно на экране
    }
  };

  return (
    <div>
      <h1>Полезные фразы</h1>
      <p className="muted">Нажмите на фразу, чтобы скопировать английский текст.</p>
      {phraseGroups.map((g) => (
        <div key={g.id}>
          <h2>{g.title}</h2>
          {g.phrases.map((p) => (
            <div className="phrase" key={p.en} onClick={() => copy(p.en)}>
              <div className="en">
                {p.en} {copied === p.en && "✅"}
              </div>
              <div className="muted">{p.ru}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
