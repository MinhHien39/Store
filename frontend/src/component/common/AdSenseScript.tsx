import Script from "next/script";
import { ADSENSE_CLIENT, isAdsenseConfigured } from "@/core/adsense";

export default function AdSenseScript() {
  if (!isAdsenseConfigured) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
