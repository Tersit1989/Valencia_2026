export type PlaceCategory =
  | "hotel"
  | "confirmed-restaurant"
  | "pending-restaurant"
  | "candidate-restaurant"
  | "attraction"
  | "optional-attraction"
  | "fallback-food"
  | "transport"
  | "emergency";

export type ReservationStatus = "confirmed" | "pending" | "candidate";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  coordinates: Coordinates;
  officialUrl: string | null;
  reservationStatus: ReservationStatus | null;
  date: string | null;
  time: string | null;
  duration: string | null;
  transportMode: string | null;
  previousPlaceId: string | null;
  routeNotes: string | null;
  importance: "core" | "optional";
  indoorOutdoor: "indoor" | "outdoor" | "mixed";
  foodRecommendations: string[];
  wineRecommendations: string[];
  childOptions: string[];
  etiquette: string[];
  facts: string[];
  childMission: string | null;
  planB: string | null;
  verificationDate: string;
  verificationStatus: "ok" | "verify";
  /** Точный текстовый адрес для навигации в Google Maps (важнее координат). */
  navQuery?: string;
}

export interface PlaceGuide {
  placeId: string;
  title: string;
  paragraphs: string[];
  question?: string;
  answer?: string;
}

export interface DayIntro {
  dayId: string;
  title: string;
  paragraphs: string[];
}

export interface ItineraryItem {
  id: string;
  start: string;
  end: string | null;
  title: string;
  placeId: string | null;
  type: "food" | "sight" | "walk" | "rest" | "transport";
  transportMode: string | null;
  optional: boolean;
  reservation?: boolean;
  notes: string[];
}

export interface Day {
  id: string;
  date: string;
  weekday: string;
  title: string;
  planB: string | null;
  items: ItineraryItem[];
}

export interface Reservation {
  place: string;
  placeId: string;
  date: string;
  time: string;
  status: ReservationStatus;
  partySize: number;
  role: string;
}

export interface RestaurantPhrase {
  for: string;
  text: string;
}

export interface Restaurant {
  placeId: string;
  name: string;
  status: ReservationStatus | "no-booking-needed";
  date: string | null;
  time: string | null;
  partySize: number;
  role: string;
  why: string[];
  orderPlan: string[];
  avoid: string[];
  phrases: RestaurantPhrase[];
  etiquette: string[];
  planB: string | null;
}

export interface Story {
  id: string;
  placeId: string;
  dayId: string;
  title: string;
  story: string;
  question: string;
  mission: string;
  badge: string;
}

export interface PhraseGroup {
  id: string;
  title: string;
  phrases: { text: string; ru: string; hint?: string }[];
}

export interface DishGroup {
  group: string;
  items: { name: string; desc: string }[];
}
