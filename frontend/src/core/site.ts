const DEFAULT_SITE_URL = "https://tmhstore.site";

const normalizeSiteUrl = (value?: string): string => {
  const trimmed = (value || "").trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

export const SITE_NAME = "TMH Store";
export const SITE_TITLE = "TMH Store | Mua sam truc tuyen de dang";
export const SITE_DESCRIPTION =
  "TMH Store cung cap san pham duoc chon loc, thong tin ro rang va kenh lien he nhanh qua Messenger.";

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL
);

export const SITE_PATHS = {
  home: "/",
  products: "/products",
  categories: "/categories",
  brands: "/brands",
  about: "/about",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
  login: "/login",
  register: "/register",
} as const;

export const ABSOLUTE_SITE_URLS = Object.fromEntries(
  Object.entries(SITE_PATHS).map(([key, path]) => [key, `${SITE_URL}${path}`])
) as Record<keyof typeof SITE_PATHS, string>;
