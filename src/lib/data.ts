import tripJson from "../data/trip.json";
import placesJson from "../data/places.json";
import itineraryJson from "../data/itinerary.json";
import restaurantsJson from "../data/restaurants.json";
import storiesJson from "../data/stories.json";
import phrasesJson from "../data/phrases.json";
import guideJson from "../data/guide.json";
import type {
  Day,
  Place,
  PlaceCategory,
  PlaceGuide,
  PhraseGroup,
  Reservation,
  Restaurant,
  Story
} from "../types";

export const trip = tripJson;
export const places = placesJson.places as Place[];
export const days = itineraryJson.days as Day[];
export const restaurants = restaurantsJson.restaurants as Restaurant[];
export const stories = storiesJson.stories as Story[];
export const phraseGroups = phrasesJson.groups as PhraseGroup[];
export const reservations = tripJson.reservations as Reservation[];

export const guides = guideJson.guides as PlaceGuide[];

const placeById = new Map(places.map((p) => [p.id, p]));
const guideByPlaceId = new Map(guides.map((g) => [g.placeId, g]));

export function getPlace(id: string | null): Place | undefined {
  return id ? placeById.get(id) : undefined;
}

export function getGuide(placeId: string | null): PlaceGuide | undefined {
  return placeId ? guideByPlaceId.get(placeId) : undefined;
}

export function getReservationFor(placeId: string): Reservation | undefined {
  return reservations.find((r) => r.placeId === placeId);
}

export const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  hotel: "#e8590c",
  "confirmed-restaurant": "#2f9e44",
  "pending-restaurant": "#f59f00",
  "candidate-restaurant": "#868e96",
  attraction: "#1971c2",
  "optional-attraction": "#868e96",
  "fallback-food": "#9c36b5",
  transport: "#495057",
  emergency: "#e03131"
};

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  hotel: "Отель",
  "confirmed-restaurant": "Ресторан — подтверждено",
  "pending-restaurant": "Ресторан — ждём подтверждения",
  "candidate-restaurant": "Ресторан — кандидат",
  attraction: "Достопримечательность",
  "optional-attraction": "Опционально",
  "fallback-food": "Еда без брони",
  transport: "Транспорт",
  emergency: "Экстренное",
};

export const STATUS_LABELS: Record<string, string> = {
  confirmed: "Подтверждено",
  pending: "Ждём подтверждения",
  candidate: "Не забронировано",
  "no-booking-needed": "Без брони"
};

export const STATUS_COLORS: Record<string, string> = {
  confirmed: "#2f9e44",
  pending: "#f59f00",
  candidate: "#868e96",
  "no-booking-needed": "#9c36b5"
};

export function routeUrl(place: Place): string {
  // Текстовый адрес надёжнее координат: Google сам находит точный вход.
  const destination = place.navQuery
    ? encodeURIComponent(place.navQuery)
    : `${place.coordinates.lat},${place.coordinates.lon}`;
  const mode = place.transportMode === "taxi" ? "driving" : "walking";
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${mode}`;
}

export function osmUrl(place: Place): string {
  const { lat, lon } = place.coordinates;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;
}
