"use client";
import { useEffect, useRef, useState } from "react";
import {
    ADSENSE_CLIENT,
    ADSENSE_TEST_MODE,
    canRenderAdSlotInSession,
    markAdSlotRendered,
    shouldLoadAdsOnClient,
} from "@/core/adsense";

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasPushedRef = useRef(false);
    const [isEligible, setIsEligible] = useState(false);
    const [isNearViewport, setIsNearViewport] = useState(false);

    useEffect(() => {
        setIsEligible(Boolean(adSlot) && shouldLoadAdsOnClient() && canRenderAdSlotInSession(adSlot));
    }, [adSlot]);

    useEffect(() => {
        if (!isEligible) return;

        const element = containerRef.current;
        if (!element || typeof IntersectionObserver === "undefined") {
            setIsNearViewport(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsNearViewport(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "320px 0px", threshold: 0.01 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [isEligible]);

    useEffect(() => {
        if (!isEligible || !isNearViewport || hasPushedRef.current) {
            return;
        }

        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            markAdSlotRendered(adSlot);
            hasPushedRef.current = true;
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.warn("AdSense could not render this ad unit.", error);
            }
        }
    }, [adSlot, isEligible, isNearViewport]);

    if (!isEligible) {
        return null;
    }

    return (
        <div ref={containerRef}>
            {isNearViewport && (
                <ins
                    className={`adsbygoogle${className ? ` ${className}` : ""}`}
                    style={{ display: "block", ...style }}
                    data-ad-client={ADSENSE_CLIENT}
                    data-ad-slot={adSlot}
                    data-ad-format={adFormat}
                    data-full-width-responsive="true"
                    data-adtest={ADSENSE_TEST_MODE ? "on" : undefined}
                />
            )}
        </div>
    );
}
