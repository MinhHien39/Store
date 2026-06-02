"use client";

import Script from "next/script";
import { getAnalyticsMeasurementId, isAnalyticsEnabled } from "@/core/firebaseAnalytics";

const GoogleAnalyticsScript = () => {
    const measurementId = getAnalyticsMeasurementId();

    if (!measurementId || !isAnalyticsEnabled()) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${measurementId}', {
                    send_page_view: false
                  });
                `}
            </Script>
        </>
    );
};

export default GoogleAnalyticsScript;
