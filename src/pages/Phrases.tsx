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
      <p className="muted">
        Нажмите на фразу, чтобы скопировать её. Серым курсивом — как
        произносить.
      </p>
      {phraseGroups.map((g) => (
        <div key={g.id}>
          <h2>{g.title}</h2>
          {g.phrases.map((p) => (
            <div className="phrase" key={p.text} onClick={() => copy(p.text)}>
              <div className="en">
                {p.text} {copied === p.text && "✅"}
              </div>
              {p.hint && (
                <div className="muted">
                  <em>{p.hint}</em>
                </div>
              )}
              <div className="muted">{p.ru}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
