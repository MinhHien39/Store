const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "";

const RAW_ADSENSE_ENABLED = (process.env.NEXT_PUBLIC_ADSENSE_ENABLED || "")
  .trim()
  .toLowerCase();

export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HOME_SLOT || "",
  productList: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PRODUCT_LIST_SLOT || "",
  productDetail: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PRODUCT_DETAIL_SLOT || "",
};

export const hasAdsenseClient = ADSENSE_CLIENT.startsWith("ca-pub-");

export const ADSENSE_ENABLED = RAW_ADSENSE_ENABLED
  ? TRUE_VALUES.has(RAW_ADSENSE_ENABLED)
  : hasAdsenseClient;

export const ADSENSE_TEST_MODE = TRUE_VALUES.has(
  (process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TEST_MODE || "").toLowerCase()
);

export const ADSENSE_SESSION_SLOT_LIMIT = Number(
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SESSION_SLOT_LIMIT || 1
);

export const isAdsenseConfigured = Boolean(
  ADSENSE_ENABLED && hasAdsenseClient
);

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const BLOCKED_PATH_PREFIXES = ["/admin"];
const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|preview|validator|lighthouse|pagespeed|headless/i;

const getSafeSessionStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const isLocalAdsHost = (hostname: string): boolean =>
  LOCAL_HOSTS.has(hostname) ||
  hostname.endsWith(".local") ||
  hostname.startsWith("192.168.") ||
  hostname.startsWith("10.") ||
  /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

export const isBlockedAdsPath = (pathname: string): boolean =>
  BLOCKED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const isLikelyBotUserAgent = (userAgent: string): boolean =>
  BOT_USER_AGENT_PATTERN.test(userAgent);

export const shouldLoadAdsenseScriptOnClient = (): boolean => {
  if (!hasAdsenseClient || typeof window === "undefined") return false;
  if (isLocalAdsHost(window.location.hostname)) return false;
  if (isBlockedAdsPath(window.location.pathname)) return false;
  return true;
};

export const shouldLoadAdsOnClient = (): boolean => {
  if (!shouldLoadAdsenseScriptOnClient() || !ADSENSE_ENABLED) return false;
  if (navigator.doNotTrack === "1") return false;
  if (isLikelyBotUserAgent(navigator.userAgent)) return false;
  return true;
};

const getAdSlotSessionKey = (adSlot: string): string => `adsense:slot:${adSlot}`;

export const canRenderAdSlotInSession = (adSlot: string): boolean => {
  const storage = getSafeSessionStorage();
  if (!storage) return true;
  const count = Number(storage.getItem(getAdSlotSessionKey(adSlot)) || 0);
  return count < Math.max(1, ADSENSE_SESSION_SLOT_LIMIT);
};

export const markAdSlotRendered = (adSlot: string): void => {
  const storage = getSafeSessionStorage();
  if (!storage) return;
  const key = getAdSlotSessionKey(adSlot);
  const count = Number(storage.getItem(key) || 0);
  storage.setItem(key, String(count + 1));
};
