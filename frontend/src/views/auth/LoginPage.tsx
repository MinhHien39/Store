"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { LoginVM } from "./LoginVM";
import "./styles.css";

const LoginPage: React.FC = () => {
    useLanguage();
    const { config, action } = LoginVM();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        action.onLoginClick();
    };

    return (
        <StoreLayout>
            <div className="auth-page">
                <div className="auth-card">
                    {/* Branding Panel */}
                    <div className="auth-branding">
                        <h2 className="auth-branding__title">{t.store.login.branding_title()}</h2>
                        <p className="auth-branding__desc">{t.store.login.branding_desc()}</p>
                        <div className="auth-features">
                            <div className="auth-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                                <span>{t.store.login.feature1()}</span>
                            </div>
                            <div className="auth-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                                <span>{t.store.login.feature2()}</span>
                            </div>
                            <div className="auth-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                                <span>{t.store.login.feature3()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Panel */}
                    <div className="auth-form-panel">
                        <h1 className="auth-form__title">{t.store.login.title()}</h1>
                        <p className="auth-form__subtitle">{t.store.login.subtitle()}</p>

                        <form onSubmit={handleSubmit} className="auth-field-group">
                            <div className="auth-field">
                                <label htmlFor="email" className="auth-label">{t.store.login.email_label()}</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={config.email}
                                    onChange={(e) => action.setNewConfig({ email: e.target.value })}
                                    placeholder="example@email.com"
                                    className="auth-input"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password" className="auth-label">{t.store.login.password_label()}</label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="password"
                                        type={config.showPassword ? "text" : "password"}
                                        value={config.password}
                                        onChange={(e) => action.setNewConfig({ password: e.target.value })}
                                        placeholder="••••••••"
                                        className="auth-input auth-input--with-icon"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => action.setNewConfig({ showPassword: !config.showPassword })}
                                        className="auth-eye-btn"
                                        aria-label={config.showPassword ? "Hide password" : "Show password"}
                                    >
                                        {config.showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-row">
                                <label className="auth-checkbox-row">
                                    <input type="checkbox" className="auth-checkbox" />
                                    <span>{t.store.login.remember_me()}</span>
                                </label>
                                <Link to="#" className="auth-forgot-link">{t.store.login.forgot_password()}</Link>
                            </div>

                            <button type="submit" className="base-button base-button--contained auth-submit" disabled={config.isSubmitting}>
                                {t.store.login.submit()}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                {t.store.login.no_account()}{" "}
                                <Link to={AppRoutePath.REGISTER} className="auth-footer__link">{t.store.login.register_link()}</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
};

export default LoginPage;
