import React, { useEffect, useState, useRef } from 'react';
import { t, Localized } from '@/core/localized';
export interface DialogConfig {
    title?: string;
    subTitle?: string;
    content: string;
    onClose: () => void;
    onAgree: () => void;
    onDisagree?: () => void;
    agreeTitle?: string;
    disagreeTitle?: string;
    isOneButton?: boolean;
}

const DialogComponent: React.FC<{ config: DialogConfig; isOpen: boolean }> = ({ config, isOpen }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isOpen) setIsVisible(true);
        else timeout = setTimeout(() => setIsVisible(false), 200);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            config.onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`base-dialog-overlay ${isOpen ? 'fade-in' : 'fade-out'}`} onClick={handleOverlayClick}>
            <div
                ref={containerRef}
                className={`base-dialog-container ${isOpen ? 'scale-in' : 'scale-out'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="base-dialog-title">{config.title || t.common.confirm()}</div>

                {config.subTitle && <div className="base-dialog-subtitle">{config.subTitle}</div>}

                <div className="base-dialog-content">{config.content}</div>

                <div className={`base-dialog-actions`}>
                    {
                        !config.isOneButton
                        && 
                        (
                            <button
                                className="base-dialog-button cancel"
                                onClick={() => {
                                    config.onDisagree?.();
                                    config.onClose();
                                }}>
                                {config.disagreeTitle || t.common.cancel()}
                            </button>
                        )
                    }

                    <button
                        className="base-dialog-button ok"
                        onClick={() => {
                            config.onAgree();
                            config.onClose();
                        }}>
                        {config.agreeTitle || t.common.agree()}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DialogComponent;