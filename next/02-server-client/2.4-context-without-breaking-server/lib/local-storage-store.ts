// A tiny external store over localStorage, for use with useSyncExternalStore.
// The server snapshot is always the fallback, so the first client render matches the server HTML.
export function createLocalStorageStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null = null;
  let cachedValue = fallback;

  function getSnapshot(): T {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw === null ? fallback : (JSON.parse(raw) as T);
      } catch {
        cachedValue = fallback;
      }
    }
    return cachedValue;
  }

  function set(value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  }

  return { subscribe, getSnapshot, getServerSnapshot: () => fallback, set };
}
