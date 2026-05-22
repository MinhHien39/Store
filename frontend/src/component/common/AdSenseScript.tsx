"use client";

import { useEffect, useState } from "react";
import { ADSENSE_CLIENT, shouldLoadAdsOnClient } from "@/core/adsense";

export default function AdSenseScript() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    setCanLoad(shouldLoadAdsOnClient());
  }, []);

  if (!canLoad) {
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
