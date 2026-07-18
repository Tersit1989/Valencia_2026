import { useCallback, useEffect, useState } from "react";

/** localStorage-backed state, synced across components via a custom event. */
export function useStoredState<T>(key: string, initial: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  }, [key, initial]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(read());
    };
    window.addEventListener("local-store", onChange);
    return () => window.removeEventListener("local-store", onChange);
  }, [key, read]);

  const update = useCallback(
    (next: T) => {
      localStorage.setItem(key, JSON.stringify(next));
      setValue(next);
      window.dispatchEvent(new CustomEvent("local-store", { detail: key }));
    },
    [key]
  );

  return [value, update] as const;
}

export const STORE_KEYS = {
  theme: "v26.theme",
  tired: "v26.tired",
  missions: "v26.missions",
  simulateDate: "v26.simulateDate"
};
