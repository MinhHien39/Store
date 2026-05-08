"use client";

import React from "react";
import { useLanguage, SupportedLanguage } from "@/provider/LanguageProvider";
import { t } from "@/core/localized";

interface LanguageSwitcherProps {
    variant?: "icon-label" | "compact";
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = "icon-label" }) => {
    const { language, setLanguage } = useLanguage();

    const isEn = language === "en";

    if (variant === "compact") {
        return (
            <div className="lang-switch lang-switch--dark">
                <button
                    onClick={() => setLanguage("en")}
                    className={`lang-switch__btn ${isEn ? "lang-switch__btn--active" : ""}`}
                    title={t.language.en()}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage("vi")}
                    className={`lang-switch__btn ${!isEn ? "lang-switch__btn--active" : ""}`}
                    title={t.language.vi()}
                >
                    VI
                </button>
            </div>
        );
    }

    return (
        <div className="lang-switch">
            <button
                onClick={() => setLanguage("en")}
                className={`lang-switch__btn ${isEn ? "lang-switch__btn--active" : ""}`}
                title={t.language.en()}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage("vi")}
                className={`lang-switch__btn ${!isEn ? "lang-switch__btn--active" : ""}`}
                title={t.language.vi()}
            >
                VI
            </button>
        </div>
    );
};

export default LanguageSwitcher;
