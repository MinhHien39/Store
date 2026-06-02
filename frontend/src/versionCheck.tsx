// ------------------------------------------------------------
// Version Checking and Reload Handling
// ------------------------------------------------------------

const VERSION_KEY = "app_version";
const VERSION_URL = "/version.json";
const RELOAD_MARK_KEY = "app_last_hard_reload_at";
const RELOAD_COOLDOWN_MS = 60_000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

let initialized = false;
let versionCheckInFlight = false;

const isBrowser = () => typeof window !== "undefined";

const shouldRunVersionCheck = () => {
  if (!isBrowser()) return false;
  if (LOCAL_HOSTS.has(window.location.hostname)) return false;
  return true;
};

const markReloadAttempt = () => {
  window.sessionStorage.setItem(RELOAD_MARK_KEY, Date.now().toString());
};

const canReloadNow = () => {
  const lastReload = Number(window.sessionStorage.getItem(RELOAD_MARK_KEY) || "0");
  return !lastReload || Date.now() - lastReload > RELOAD_COOLDOWN_MS;
};

const isNextStaticAsset = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  const url =
    target instanceof HTMLScriptElement
      ? target.src
      : target instanceof HTMLLinkElement
        ? target.href
        : "";

  if (!url) return false;

  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin && parsed.pathname.startsWith("/_next/static/");
  } catch {
    return false;
  }
};

const requestHardReload = async (reason: string) => {
  if (!shouldRunVersionCheck()) return;
  if (!canReloadNow()) {
    console.warn(`Skip hard reload during cooldown: ${reason}`);
    return;
  }

  console.warn(`Hard reload requested: ${reason}`);
  markReloadAttempt();
  await hardReload();
};

/**
 * Perform a hard reload of the application.
 * This method:
 *  - Unregisters all active Service Workers.
 *  - Clears the browser Cache Storage.
 *  - Forces a full reload with a cache-busting query parameter.
 */
export async function hardReload(): Promise<void> {
  try {
    // Unregister all active service workers
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }

    // Clear all cache storage keys
    if ("caches" in window && typeof caches.keys === "function") {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    // Append a cache-busting parameter to the current URL and reload.
    const url = new URL(window.location.href);
    url.searchParams.set("v", Date.now().toString());
    window.location.replace(url.toString());
  } catch (e) {
    console.error("Hard reload failed:", e);

    // Fallback reload if an error occurs
    const sep = window.location.href.includes("?") ? "&" : "?";
    window.location.href = window.location.href + `${sep}v=${Date.now()}`;
  }
}

/**
 * Check the current app version using version.json.
 * Behavior:
 *  - On first run, stores the version in localStorage.
 *  - If a new version is detected, updates the stored version.
 *  - If up-to-date, no action is taken.
 */
export async function checkAppVersion(): Promise<void> {
  if (!shouldRunVersionCheck()) return;
  if (versionCheckInFlight) return;

  versionCheckInFlight = true;

  try {
    // Fetch version.json with no caching
    const res = await fetch(VERSION_URL, { cache: "no-cache" });
    if (!res.ok) {
      console.warn("version.json not found:", res.status);
      return;
    }

    // Parse version data
    const text = await res.text();
    const data = JSON.parse(text) as { version: string; buildTime: string };

    // Compare with the stored version
    const current = localStorage.getItem(VERSION_KEY);
    if (!current) {
      localStorage.setItem(VERSION_KEY, data.version);
      console.log("First run — stored version:", data.version);
      return;
    }

    if (current !== data.version) {
      console.log("New version detected:", current, "→", data.version);
      localStorage.setItem(VERSION_KEY, data.version);
      await requestHardReload("new app version");
    } else {
      console.log("App is up-to-date:", current);
    }
  } catch (err) {
    console.warn("Version check failed:", err);
  } finally {
    versionCheckInFlight = false;
  }
}

/**
 * Initialize the global version check system.
 * This sets up listeners for:
 *  - Window focus events (to recheck version).
 *  - Missing static JS/CSS files (auto reload if a script/link fails).
 *  - Lazy-loaded chunk failures (auto reload on ChunkLoadError).
 */
export function initVersionCheck(): void {
  if (initialized) return;
  initialized = true;

  if (!shouldRunVersionCheck()) {
    console.log("Version check disabled for this host");
    return;
  }

  // Perform an initial version check
  checkAppVersion();

  // Check again whenever the window gains focus
  window.addEventListener("focus", checkAppVersion);

  // Reload automatically if a JS or CSS file fails to load
  window.addEventListener(
    "error",
    (ev) => {
      const target = ev.target as HTMLElement;
      if (isNextStaticAsset(target)) {
        requestHardReload("missing Next static asset");
      }
    },
    true
  );

  // Reload automatically if a lazy-loaded chunk fails to load
  window.addEventListener("unhandledrejection", (event) => {
    const message = (event.reason?.message || event.reason || "").toString();
    if (
      message.includes("ChunkLoadError") ||
      message.includes("Loading chunk") ||
      message.includes("Failed to fetch dynamically imported module")
    ) {
      requestHardReload("chunk load failure");
    }
  });

  window.addEventListener("error", (event) => {
    const message = (event as ErrorEvent).message || "";
    if (message.includes("Failed to find Server Action")) {
      requestHardReload("server action mismatch");
    }
  });

  console.log("Version check initialized");
}
