"use client";

import React from "react";
import { Loader2, LogIn } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminLoginVM } from "./AdminLoginVM";

const AdminLoginPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminLoginVM();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        action.onLoginClick();
    };

    const isLoading = false;
    const error = config.errorMsgList.length > 0 ? config.errorMsgList[0] : "";

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <span className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                            <LogIn size={18} className="text-white" />
                        </span>
                        <span className="text-xl font-extrabold text-foreground font-heading tracking-tight">Store</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.admin.login.subtitle()}</p>
                </div>

                <div className="card p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="label">{t.admin.login.email_label()}</label>
                            <input id="email" type="email"
                                value={config.request.emailOrUserId || ""}
                                onChange={(e) => action.setNewConfig({ request: { ...config.request, emailOrUserId: e.target.value } as any })}
                                placeholder="admin@storeamazon.com"
                                className="input" autoComplete="email" />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">{t.admin.login.password_label()}</label>
                            <input id="password" type="password"
                                value={config.request.password || ""}
                                onChange={(e) => action.setNewConfig({ request: { ...config.request, password: e.target.value } as any })}
                                placeholder="••••••••"
                                className="input" autoComplete="current-password" />
                        </div>

                        <button type="submit" disabled={isLoading}
                            className={`btn w-full py-3 text-[15px] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'btn-primary'}`}>
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                            {isLoading ? t.admin.login.submitting() : t.admin.login.submit()}
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-muted-foreground text-center">
                        {t.admin.login.test_credentials()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
