import { days, getPlace } from "./data";

/** Экспорт всего расписания в iCalendar (.ics): импортируется в календарь
 *  телефона один раз, и система сама напоминает за 15 минут до каждого
 *  пункта — даже когда приложение закрыто, а экран заблокирован. */

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function dt(date: string, time: string): string {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + mins, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function buildTripIcs(): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Valencia 2026 Family Guide//RU",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Валенсия 2026",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Madrid",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "END:STANDARD",
    "END:VTIMEZONE"
  ];

  for (const day of days) {
    for (const item of day.items) {
      const place = getPlace(item.placeId);
      const end = item.end ?? addMinutes(item.start, 30);
      const description = [
        item.optional ? "Опциональный пункт — можно пропустить." : "",
        ...item.notes
      ]
        .filter(Boolean)
        .join("\n");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${day.id}-${item.id}@valencia2026`,
        `DTSTAMP:20260719T000000Z`,
        `DTSTART;TZID=Europe/Madrid:${dt(day.date, item.start)}`,
        `DTEND;TZID=Europe/Madrid:${dt(day.date, end)}`,
        `SUMMARY:${escapeText(item.title)}`,
        ...(place ? [`LOCATION:${escapeText(`${place.name}, ${place.address}`)}`] : []),
        ...(description ? [`DESCRIPTION:${escapeText(description)}`] : []),
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText(`Через 15 минут: ${item.title}`)}`,
        "TRIGGER:-PT15M",
        "END:VALARM",
        "END:VEVENT"
      );
    }
  }
  lines.push("END:VCALENDAR");
  // iCalendar требует CRLF
  return lines.join("\r\n");
}

export function downloadTripIcs(): void {
  const blob = new Blob([buildTripIcs()], {
    type: "text/calendar;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "valencia-2026.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
