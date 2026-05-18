export const DEFAULT_ADSENSE_CLIENT = "ca-pub-7506165637952791";

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT;

export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HOME_SLOT || "",
  productList: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PRODUCT_LIST_SLOT || "",
  productDetail: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PRODUCT_DETAIL_SLOT || "",
};

export const isAdsenseConfigured = Boolean(
  ADSENSE_CLIENT && ADSENSE_CLIENT.startsWith("ca-pub-")
);
