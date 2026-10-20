const LAST_ROUTE_KEY = "lubuto-reader:last-route";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isLessonRoute(value: string | null): value is string {
  return value !== null && (/^\/[\w-]+\/\d+$/.test(value) || value === "/");
}

export function getSavedRoute(): string | undefined {
  try {
    const route = canUseStorage() ? window.localStorage.getItem(LAST_ROUTE_KEY) : null;
    return isLessonRoute(route) && route !== "/" ? route : undefined;
  } catch {
    return undefined;
  }
}

export function saveRoute(route: string): void {
  if (!isLessonRoute(route)) return;

  try {
    if (canUseStorage()) window.localStorage.setItem(LAST_ROUTE_KEY, route);
  } catch {
    // The reader remains usable when storage is disabled or unavailable.
  }
}

