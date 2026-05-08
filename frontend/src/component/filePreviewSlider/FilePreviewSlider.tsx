import React, { useEffect, useRef, useState } from 'react';
import {
  ic_arrow_right,
  ic_arrow_left,
  ic_close
} from '@/assets/images';
import "./filePreviewSlider.css";

export interface FilePreviewSliderProps {
    index: number;
    fileUrlList: string[];
    onClose: () => void;
}

const FilePreviewSlider: React.FC<{ props: FilePreviewSliderProps }> = ({ props }) => {
    const { index, fileUrlList, onClose } = props
    const [currentIndex, setCurrentIndex] = useState(index);
    const [isZoomed, setIsZoomed] = useState(false);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const pointer = useRef({ isDragging: false, originX: 0, originY: 0, startX: 0, startY: 0 });
    const imageRef = useRef<HTMLImageElement>(null);

    const prev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : fileUrlList.length - 1));
    };

    const next = () => {
        setCurrentIndex((prev) => (prev < fileUrlList.length - 1 ? prev + 1 : 0));
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const rect = (e.currentTarget as HTMLImageElement).getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        container.style.setProperty('--zoom-x', `${clickX}%`);
        container.style.setProperty('--zoom-y', `${clickY}%`);

        setIsZoomed(prev => !prev);
        if (isZoomed) {
            setTranslate({ x: 0, y: 0 });
        }
    };

    useEffect(() => {
        setIsZoomed(false);
    }, [currentIndex]);

    useEffect(() => {
        if (isZoomed) {
            return;
        }
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let startX = 0;
        let endX = 0;

        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };

        const onTouchEnd = (e: TouchEvent) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        };

        const onMouseDown = (e: MouseEvent) => {
            startX = e.clientX;
        };

        const onMouseUp = (e: MouseEvent) => {
            endX = e.clientX;
            handleSwipe();
        };

        const handleSwipe = () => {
            const diff = endX - startX;
            if (Math.abs(diff) < 50) {
                return;
            }
            if (diff > 0) {
                prev()
            }
            else {
                next();
            }
        };

        container.addEventListener("touchstart", onTouchStart, {passive: true});
        container.addEventListener("touchend", onTouchEnd, {passive: true});
        container.addEventListener("mousedown", onMouseDown, {passive: true});
        container.addEventListener("mouseup", onMouseUp, {passive: true});

        return () => {
            container.removeEventListener("touchstart", onTouchStart);
            container.removeEventListener("touchend", onTouchEnd);
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseup", onMouseUp);
        };
    }, [currentIndex, isZoomed]);

    useEffect(() => {
        const image = imageRef.current;
        const container = containerRef.current;
        if (!image || !container) {
            return;
        }

        const onPointerDown = (e: PointerEvent) => {
            if (!isZoomed) {
                return;
            }
            e.preventDefault();
            pointer.current.isDragging = true;
            pointer.current.startX = e.clientX;
            pointer.current.startY = e.clientY;
            pointer.current.originX = translate.x;
            pointer.current.originY = translate.y;
            image.setPointerCapture(e.pointerId);
            document.body.style.cursor = "grabbing";
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!pointer.current.isDragging || !isZoomed) {
                return;
            }
            e.preventDefault();
            const dx = e.clientX - pointer.current.startX;
            const dy = e.clientY - pointer.current.startY;

            const image = imageRef.current;
            const container = containerRef.current;
            if (!image || !container) {
                return;
            }

            const naturalW = image.naturalWidth;
            const naturalH = image.naturalHeight;
            const contRect = container.getBoundingClientRect();
            const contW = contRect.width;
            const contH = contRect.height;
            const scale = 2;

            let displayW = contW, displayH = contH;
            const imageRatio = naturalW / naturalH;
            const contRatio = contW / contH;
            if (imageRatio > contRatio) {
                displayW = contW;
                displayH = contW / imageRatio;
            } else {
                displayH = contH;
                displayW = contH * imageRatio;
            }

            const zoomedW = displayW * scale;
            const zoomedH = displayH * scale;
            const maxX = Math.max(0, (zoomedW - contW) / 2);
            const maxY = Math.max(0, (zoomedH - contH) / 2);

            let nextX = pointer.current.originX + dx;
            let nextY = pointer.current.originY + dy;
            nextX = Math.max(-maxX, Math.min(maxX, nextX));
            nextY = Math.max(-maxY, Math.min(maxY, nextY));
            setTranslate({ x: nextX, y: nextY });
        };

        const onPointerUp = () => {
            pointer.current.isDragging = false;
            document.body.style.cursor = "";
        };

        image.addEventListener("pointerdown", onPointerDown);
        image.addEventListener("pointermove", onPointerMove);
        image.addEventListener("pointerup", onPointerUp);
        image.addEventListener("pointerleave", onPointerUp);

        return () => {
            image.removeEventListener("pointerdown", onPointerDown);
            image.removeEventListener("pointermove", onPointerMove);
            image.removeEventListener("pointerup", onPointerUp);
            image.removeEventListener("pointerleave", onPointerUp);
            document.body.style.cursor = "";
        };
    }, [isZoomed, translate.x, translate.y]);


    useEffect(() => {
        const image = imageRef.current;
        if (!image) {
            return;
        }
        image.style.setProperty('--translate-x', `${translate.x}px`);
        image.style.setProperty('--translate-y', `${translate.y}px`);
    }, [translate.x, translate.y]);


    return (
        <div
            className="file-preview-slider-background fixed inset-0 z-999 d-flex flex-column justify-content-center align-items-center"
        >
            <div className="absolute top-0 w-full d-flex justify-content-center pt-6">
                <div className="absolute top-0 m-4 text-2xl text-white font-bold cursor-pointer z-100">
                    {currentIndex + 1} / {fileUrlList.length}
                </div>
                <button
                    onClick={onClose}
                    className="absolute right-0 top-0 m-4 text-2xl font-bold cursor-pointer z-100"
                >
                    <img src={ic_close} />
                </button>
            </div>

            <div
                ref={containerRef}
                className="w-full h-full d-flex relative align-items-center justify-content-center mt-4"
                style={{ touchAction: 'manipulation' }}
            >
                <button
                    onClick={prev}
                    className="file-preview-slider-icon-arrow-button h-14 w-14 absolute left-0 cursor-pointer rounded-full d-flex align-items-center justify-content-center ml-2 z-100"
                    style={{ backgroundColor: 'black' }}
                >
                    <img src={ic_arrow_left} />
                </button>

                <img
                    ref={imageRef}
                    src={fileUrlList[currentIndex]}
                    alt={`image-${currentIndex}`}
                    className={`rounded-2 transition object-fit-contain transform ${isZoomed ? "file-preview-slider-zoomed cursor-zoom-out" : "file-preview-slider-un-zoomed cursor-zoom-in"}`}
                    onDoubleClick={handleDoubleClick}
                />

                <button
                    onClick={next}
                    className="file-preview-slider-icon-arrow-button h-14 w-14 absolute right-0 cursor-pointer rounded-full d-flex align-items-center justify-content-center mr-2 z-100"
                    style={{ backgroundColor: 'black' }}
                >
                    <img src={ic_arrow_right} />
                </button>
            </div>
        </div>
    );
};

export default FilePreviewSlider;
