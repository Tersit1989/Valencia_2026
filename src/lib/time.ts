import { days, trip } from "./data";
import type { Day, ItineraryItem } from "../types";

const TZ = trip.trip.timezone;

/** Current date (YYYY-MM-DD) and minutes since midnight in Europe/Madrid. */
export function madridNow(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const minutes = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
  return { date, minutes };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatMinutesLeft(mins: number): string {
  if (mins <= 0) return "сейчас";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `через ${m} мин`;
  return `через ${h} ч ${m > 0 ? `${m} мин` : ""}`.trim();
}

export function findDayByDate(date: string): Day | undefined {
  return days.find((d) => d.date === date);
}

export interface NowState {
  day: Day | undefined;
  current: ItineraryItem | undefined;
  next: ItineraryItem | undefined;
  minutesToNext: number | undefined;
  phase: "before-trip" | "trip" | "after-trip";
}

/** What is happening now / next, for a given date + time (Madrid). */
export function computeNowState(
  date: string,
  minutes: number,
  hideOptional: boolean
): NowState {
  if (date < trip.trip.startDate)
    return {
      day: undefined,
      current: undefined,
      next: undefined,
      minutesToNext: undefined,
      phase: "before-trip"
    };
  if (date > trip.trip.endDate)
    return {
      day: undefined,
      current: undefined,
      next: undefined,
      minutesToNext: undefined,
      phase: "after-trip"
    };
  const day = findDayByDate(date);
  const items = (day?.items ?? []).filter(
    (i) => !hideOptional || !i.optional
  );
  let current: ItineraryItem | undefined;
  let next: ItineraryItem | undefined;
  for (const item of items) {
    const start = toMinutes(item.start);
    const end = item.end ? toMinutes(item.end) : start + 30;
    if (start <= minutes && minutes < end) current = item;
    if (start > minutes) {
      next = item;
      break;
    }
  }
  const minutesToNext = next ? toMinutes(next.start) - minutes : undefined;
  return { day, current, next, minutesToNext, phase: "trip" };
}
