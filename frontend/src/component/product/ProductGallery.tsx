"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, getProductPlaceholderImage, isBlankImageElement } from "@/core/utils/currency";
import type { ProductImage } from "@/data/models/Product";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
    mainImage?: string | null;
    images: ProductImage[];
    productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ mainImage, images, productName }) => {
    // Always show mainImage first, then additional images (dedup by URL)
    const mainResolved = mainImage ? getImageUrl(mainImage) : null;
    const additionalResolved = [...images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => getImageUrl(img.image_url))
        .filter((url) => url !== mainResolved);
    const allImages = mainResolved
        ? [mainResolved, ...additionalResolved]
        : additionalResolved;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

    const hasPrev = selectedIndex > 0;
    const hasNext = selectedIndex < allImages.length - 1;

    const goPrev = useCallback(() => { if (hasPrev) setSelectedIndex((i) => i - 1); }, [hasPrev]);
    const goNext = useCallback(() => { if (hasNext) setSelectedIndex((i) => i + 1); }, [hasNext]);

    const handleImgError = useCallback((idx: number) => {
        setImgErrors((prev) => new Set(prev).add(idx));
    }, []);

    const handleImgLoad = useCallback((idx: number, event: React.SyntheticEvent<HTMLImageElement>) => {
        if (isBlankImageElement(event.currentTarget)) {
            handleImgError(idx);
        }
    }, [handleImgError]);

    const currentSrc = allImages[selectedIndex];
    const showFallback = !currentSrc || imgErrors.has(selectedIndex);

    return (
        <div className={styles.gallery}>
            <div className={styles.mainFrame}>
                {showFallback ? (
                    <img
                        src={getProductPlaceholderImage(productName)}
                        alt={productName}
                        className={styles.mainImage}
                        draggable={false}
                    />
                ) : (
                    <img
                        src={currentSrc}
                        alt={productName}
                        className={styles.mainImage}
                        onLoad={(event) => handleImgLoad(selectedIndex, event)}
                        onError={() => handleImgError(selectedIndex)}
                        draggable={false}
                    />
                )}

                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={goPrev}
                            disabled={!hasPrev}
                            aria-label="Previous image"
                            className={`${styles.arrowButton} ${styles.arrowLeft}`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={goNext}
                            disabled={!hasNext}
                            aria-label="Next image"
                            className={`${styles.arrowButton} ${styles.arrowRight}`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {allImages.length > 1 && (
                    <span className={styles.counter}>
                        {selectedIndex + 1} / {allImages.length}
                    </span>
                )}
            </div>

            {allImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {allImages.map((img, idx) => {
                        const isActive = idx === selectedIndex;
                        const hasError = imgErrors.has(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`${styles.thumbnailButton} ${isActive ? styles.thumbnailActive : ""}`}
                            >
                                {hasError ? (
                                    <img
                                        src={getProductPlaceholderImage(productName)}
                                        alt={`${productName} - ${idx + 1}`}
                                        className={styles.thumbnailImage}
                                        draggable={false}
                                    />
                                ) : (
                                    <img
                                        src={img}
                                        alt={`${productName} - ${idx + 1}`}
                                        className={styles.thumbnailImage}
                                        loading="lazy"
                                        onLoad={(event) => handleImgLoad(idx, event)}
                                        onError={() => handleImgError(idx)}
                                        draggable={false}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
