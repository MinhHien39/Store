import React, { useEffect, useRef, useState, CSSProperties } from "react";
import "./styles.css";

type ImageSource = string | Blob | File;

export interface LazyImageLoadingProps {
    data?: ImageSource;
    className?: string;
    style?: CSSProperties;
    alt?: string;
}

const ONE_DAY = 24 * 60 * 60 * 1000;

const imageCache = new Map<
    string,
    { url: string; time: number }
>();
/**
 * Convert data to usable URL
 */
const resolveSource = (data: ImageSource): string => {
    if (typeof data === "string") {
        return data;
    }
    return URL.createObjectURL(data);
};

/**
 * LazyImage Component
 */
const LazyImageLoading: React.FC<LazyImageLoadingProps> = ({ 
    data,
    className,
    style,
    alt
}) => {
    const imageRef = useRef<HTMLDivElement>(null);

    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [srcImage, setSrcImage] = useState<string>(); 

    /**
     * Lazy detect viewport
     */
    useEffect(() => {
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            observer.disconnect();
        }
    }, []);

    // Reset loaded when image changes
    useEffect(() => {
        setLoaded(false);
    }, [data]);

    /**
     * Load image when visible
     */
    useEffect(() => {
        if (!visible || !data) {
            return;
        }

        const baseKey =
        (typeof data === "string"
            ? data
            : data instanceof File
                ? `${data.name}-${data.size}-${data.lastModified}`
                : `blob-${data.size}-${Date.now()}`);

        const cached = imageCache.get(baseKey);

        if (cached && Date.now() - cached.time < ONE_DAY) {
            setSrcImage(cached.url);
            return;
        }

        const resolved = resolveSource(data);

        if (typeof data === "string") {
            // Let browser cache normally
            setSrcImage(resolved);

            imageCache.set(baseKey, {
                url: resolved,
                time: Date.now()
            });
        } else {
            setSrcImage(resolved);
        }

    }, [visible, data]);

    useEffect(() => {
        return () => {
            if (srcImage && typeof data !== "string") {
                URL.revokeObjectURL(srcImage);
            }
        };
    }, [srcImage, data]);

    return (
        <div
            ref={imageRef}
            className={`lazy-image-wrapper ${className ?? ""}`}
            style={style}
        >
            {
                !loaded
                &&
                <div className="lazy-image-skeleton" />
            }

            {
                srcImage 
                && 
                <img
                    src={srcImage}
                    alt={alt}
                    className="lazy-image-img"
                    onLoad={() => setLoaded(true)}
                />
            }
        </div>
    );
};

export default LazyImageLoading;

/**
 * ==========================================================
 * EXAMPLE USAGE (Using config + action pattern)
 * ==========================================================
 *
 * // 1️⃣ Import
 *
 * import LazyImageLoading from "@/components/LazyImageLoading";
 *
 *
 * // 2️⃣ Use inside a Page component (NO useState)
 *
 * {
 *     config.imageFile && (
 *         <div>
 *             <LazyImageLoading
 *                props={{
 *                 data: config.imageFile,
 *                 className: "w-48 h-48",
 *                 style: {
 *                     width: "100%",
 *                     height: "100%",
 *                     borderRadius: 12
 *                 }
 *                }}
 *             />
 *         </div>
 *     )
 * }
 *
 *
 * // 3️⃣ Update data via config (VM pattern)
 *
 * <input
 *     type="file"
 *     accept="image/*"
 *     onChange={(e) => {
 *         const file = e.target.files?.[0];
 *         if (!file) {
 *             return;
 *         }
 *
 *         config.imageFile = file;
 *         action.setNewConfig(config);
 *     }}
 * />
 *
 *
 * ==========================================================
 * Supports:
 * - string (URL)
 * - Blob
 * - File
 *
 * Features:
 * - Lazy loading (IntersectionObserver)
 * - Skeleton loading
 * - Cache by view size
 * - Cache duration: 1 day
 * ==========================================================
 */