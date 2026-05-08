"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Package } from "lucide-react";
import type { ProductImage } from "@/data/models/Product";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
    mainImage?: string | null;
    images: ProductImage[];
    productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ mainImage, images, productName }) => {
    const allImages = images.length > 0
        ? [...images].sort((a, b) => a.sort_order - b.sort_order).map((img) => img.image_url)
        : mainImage ? [mainImage] : [];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

    const hasPrev = selectedIndex > 0;
    const hasNext = selectedIndex < allImages.length - 1;

    const goPrev = useCallback(() => { if (hasPrev) setSelectedIndex((i) => i - 1); }, [hasPrev]);
    const goNext = useCallback(() => { if (hasNext) setSelectedIndex((i) => i + 1); }, [hasNext]);

    const handleImgError = useCallback((idx: number) => {
        setImgErrors((prev) => new Set(prev).add(idx));
    }, []);

    const currentSrc = allImages[selectedIndex];
    const showFallback = !currentSrc || imgErrors.has(selectedIndex);

    return (
        <div className={styles.gallery}>
            <div className={styles.mainFrame}>
                {showFallback ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <Package size={46} strokeWidth={1.7} />
                        </div>
                        <p className={styles.emptyTitle}>{productName}</p>
                        <span className={styles.emptyText}>Product image coming soon</span>
                    </div>
                ) : (
                    <img
                        src={currentSrc}
                        alt={productName}
                        className={styles.mainImage}
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
                                    <div className={styles.thumbnailEmpty}>
                                        <ImageOff size={16} />
                                    </div>
                                ) : (
                                    <img
                                        src={img}
                                        alt={`${productName} - ${idx + 1}`}
                                        className={styles.thumbnailImage}
                                        loading="lazy"
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
