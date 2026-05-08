"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";

const NotFoundPage: React.FC = () => {
    useLanguage();
    return (
        <StoreLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
                <h1 className="type-giant text-primary">
                    404
                </h1>
                <p className="text-xl md:text-2xl font-bold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t.store.notfound.title()}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-10">
                    {t.store.notfound.desc()}
                </p>
                <Link
                    to={AppRoutePath.HOME}
                    className="btn btn-primary btn-lg"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    {t.store.notfound.back_home()}
                </Link>
            </div>
        </StoreLayout>
    );
};

export default NotFoundPage;
