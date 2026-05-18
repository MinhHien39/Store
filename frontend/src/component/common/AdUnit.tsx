"use client";
import { useEffect } from "react";
import { ADSENSE_CLIENT, isAdsenseConfigured } from "@/core/adsense";

interface AdUnitProps {
    adSlot: string;
    adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
    style?: React.CSSProperties;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle?: Array<Record<string, unknown>>;
    }
}

export default function AdUnit({
    adSlot,
    adFormat = "auto",
    style,
    className,
}: AdUnitProps) {
    const shouldRender = isAdsenseConfigured && Boolean(adSlot);

    useEffect(() => {
        if (!shouldRender) {
            return;
        }

        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.warn("AdSense could not render this ad unit.", error);
            }
        }
    }, [adSlot, shouldRender]);

    if (!shouldRender) {
        return null;
    }

    return (
        <ins
            className={`adsbygoogle${className ? ` ${className}` : ""}`}
            style={{ display: "block", ...style }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
        />
    );
}
