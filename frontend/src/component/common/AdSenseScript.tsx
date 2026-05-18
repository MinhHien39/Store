import { ADSENSE_CLIENT, isAdsenseConfigured } from "@/core/adsense";

export default function AdSenseScript() {
  if (!isAdsenseConfigured) {
    return null;
  }

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
