"use client";

import { useEffect, useState } from "react";
import {
  ADSENSE_CLIENT,
  shouldLoadAdsenseScriptOnClient,
} from "@/core/adsense";

export default function AdSenseScript() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    setCanLoad(shouldLoadAdsenseScriptOnClient());
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
