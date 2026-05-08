"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
    image: string;
    align: "left" | "center";
    theme: "dark" | "light";
}

const slides: Slide[] = [
    {
        id: 1,
        title: "SUMMER\nCOLLECTION",
        subtitle: "2025年サマーコレクション。新しいスタイルで夏を楽しもう。",
        cta: "今すぐ購入",
        ctaLink: `${AppRoutePath.PRODUCTS}?sort=newest`,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop",
        align: "left",
        theme: "light",
    },
    {
        id: 2,
        title: "最大50%OFF",
        subtitle: "期間限定セール開催中。お見逃しなく。",
        cta: "セールを見る",
        ctaLink: `${AppRoutePath.PRODUCTS}?sale=true`,
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop",
        align: "center",
        theme: "dark",
    },
    {
        id: 3,
        title: "NEW\nARRIVALS",
        subtitle: "厳選された最新アイテムをチェック。",
        cta: "コレクションを見る",
        ctaLink: AppRoutePath.PRODUCTS,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop",
        align: "left",
        theme: "dark",
    },
];

const HeroBanner: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((p) => (p + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];
    const isLight = slide.theme === "light";

    return (
        <section className="relative w-full aspect-[16/7] md:aspect-[16/6] overflow-hidden bg-primary">
            {/* Image */}
            <img
                src={slide.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                loading="eager"
            />
            <div className={`absolute inset-0 ${isLight ? "bg-white/20" : "bg-black/40"}`} />

            {/* Content */}
            <div className={`relative h-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col justify-end pb-12 md:pb-20 ${slide.align === "center" ? "items-center text-center" : "items-start"}`}>
                <h2
                    className={`type-giant whitespace-pre-line mb-5 ${isLight ? "text-primary" : "text-white"}`}
                >
                    {slide.title}
                </h2>
                <p className={`text-base md:text-lg mb-8 max-w-lg ${isLight ? "text-primary/70" : "text-white/80"}`} style={{ fontFamily: 'var(--font-body)' }}>
                    {slide.subtitle}
                </p>
                <Link
                    to={slide.ctaLink}
                    className={`type-label inline-flex items-center gap-3 px-10 py-4 text-[12px] transition-all duration-200 hover:opacity-90 ${
                        isLight ? "bg-primary text-on-primary" : "bg-white text-primary"
                    }`}
                >
                    {slide.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-[3px] transition-all duration-300 ${
                            i === current ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`スライド ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroBanner;
