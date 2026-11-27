import { useCallback, useEffect, useState } from "react";
export function useStoredList(key: string) {
  const [state, setState] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  });
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(state)),
    [key, state],
  );
  const toggle = useCallback(
    (id: string) =>
      setState((s) =>
        s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
      ),
    [],
  );
  return [state, setState, toggle] as const;
}
