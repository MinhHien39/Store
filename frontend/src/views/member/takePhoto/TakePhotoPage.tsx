import React from "react";
import BaseView from '@/core/base/BaseView';
import "./styles.css";
import OrientationLockView from "./OrientationLockView";
import { TakePhotoVM, TakePhotoMode } from "./TakePhotoVM";
import TakePhotoPreviewView from "./TakePhotoPreviewView";
import { PropertyPhoto } from "@/data";
import { ic_close } from '@/assets/images';

export interface TakePhotoProps {
    propertyPhoto: PropertyPhoto;
    onClose: () => void;
    onSubmit: (file: File) => void;
}

// Check if running in local development mode
export const isLocal = process.env.NEXT_PUBLIC_MODE === 'local';

/**
 * TakePhoto screen - Fullscreen camera overlay.
 *
 * Layout structure:
 *   ┌─────────────────────────┐
 *   │  Property Title Bar     │  ← Only visible in CAPTURE mode
 *   │─────────────────────────│
 *   │                         │
 *   │   Camera Feed / Image   │  ← Video (CAPTURE) or Image (PREVIEW)
 *   │                         │
 *   │─────────────────────────│
 *   │  [Capture] / [✕] [✓]   │  ← Capture button or Retake/Save buttons
 *   └─────────────────────────┘
 *
 * Modes:
 *   - CAPTURE: Camera is running, displaying viewfinder + capture button
 *     - If the device is in portrait → display OrientationLockView on top
 *   - PREVIEW: Display captured image + Save/Retake buttons
 *
 * z-index: 9999 (fullscreen overlay, covering all other UI elements)
 */
const TakePhotoPage: React.FC<{ props?: TakePhotoProps }> = ({ props }) => {
    const { config, action } = TakePhotoVM(props);

    return (
        <BaseView className="take-photo-page--container">
            {/* ── CAPTURE MODE: Camera viewfinder ────────────────────── */}
            {
                config.mode === TakePhotoMode.CAPTURE
                &&
                <div className="relative w-full h-full d-flex align-items-center justify-content-center">
                    {/*
                      Video element receiving the camera stream from TakePhotoVM.
                      - autoPlay: Start playing immediately when the stream is available
                      - playsInline: Prevent iOS from opening a fullscreen player (required for mobile)
                      - muted: Required for autoPlay to work on mobile browsers
                    */}
                    <video
                        ref={action.videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-fit-cover"
                    />

                    {/* Hidden canvas - used to capture a frame from the video when taking a photo */}
                    <canvas
                        ref={action.canvasRef}
                        className="d-none"
                    />

                    {/*
                      Orientation lock overlay - displayed when the device is in portrait mode.
                      Prompts the user to rotate the device horizontally to capture photos.
                      This overlay covers the entire camera view with a backdrop-filter blur.
                    */}
                    {
                        config.isPortrait
                        &&
                        <OrientationLockView />
                    }

                    {/* Capture button - positioned at the bottom center */}
                    {
                        config.mode === TakePhotoMode.CAPTURE
                        &&
                        <div className="absolute b-8 left-0 w-full d-flex d-flex-column align-items-center gap-2">
                            <button
                                className="take-photo-page--capture-button"
                                onClick={action.onCaptureClick}
                            />
                        </div>
                    }

                    {/* Debug overlay - only visible in local dev mode, displaying camera specs */}
                    {isLocal && config.trackInfo && (
                        <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-70 text-white text-sm d-flex d-flex-column gap-1 z-10">
                            <div>Width: {config.trackInfo.width}px</div>
                            <div>Height: {config.trackInfo.height}px</div>
                            <div>Frame Rate: {config.trackInfo.frameRate}fps</div>
                            <div>Facing Mode: {config.trackInfo.facingMode}</div>
                        </div>
                    )}
                </div>
            }

            {/* ── PREVIEW MODE: Captured photo + Save/Retake buttons ────── */}
            {
                config.mode === TakePhotoMode.PREVIEW && config.takePhotoPreviewProps
                &&
                <TakePhotoPreviewView
                    props={config.takePhotoPreviewProps}
                />
            }

            {/* ── Property title bar (top) - only visible in CAPTURE mode ── */}
            {
                config.mode !== TakePhotoMode.PREVIEW
                &&
                <div
                    className="d-flex absolute w-full align-items-center t-0 pl-4 text-xl text-color--white h-10"
                    style={{ background: "rgba(0, 0, 0, 0.3)" }}
                >
                    {props.propertyPhoto.getTakePhotoLabel()}
                </div>
            }

            {/* ── Global Close Button ── */}
            <div
                className="absolute d-flex align-items-center justify-content-center cursor-pointer z-50 p-2"
                style={{ top: 0, right: '8px', height: '2.5rem' }}
                onClick={props.onClose}
            >
                <img src={ic_close} alt="Close" style={{ width: 24, height: 24 }} />
            </div>


        </BaseView>
    );
};

export default TakePhotoPage;
