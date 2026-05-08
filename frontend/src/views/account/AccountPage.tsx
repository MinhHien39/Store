"use client";

import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import {
    ChevronRight,
    LogOut,
    Mail,
    MessageCircle,
    Package,
    Phone,
    User,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AccountVM } from "./AccountVM";
import "./account.css";

const MESSENGER_URL = "https://m.me/xh.456789";

const AccountPage: React.FC = () => {
    useLanguage();
    const { config, action } = AccountVM();
    const { user, isAuthenticated } = config;

    if (!isAuthenticated || !user) {
        return <Navigate to={AppRoutePath.LOGIN} replace />;
    }

    return (
        <StoreLayout>
            <section className="account-page">
                <div className="container-page account-page__inner">
                    {/* Header */}
                    <div className="account-header motion-fade-up">
                        <div className="account-header__avatar">
                            <User size={32} />
                        </div>
                        <div className="account-header__info">
                            <h1 className="account-header__name">{user.fullName || user.email}</h1>
                            <p className="account-header__email">{user.email}</p>
                        </div>
                    </div>

                    {/* Content grid */}
                    <div className="account-grid motion-fade-up motion-delay-1">
                        {/* Personal info card */}
                        <div className="account-card">
                            <h2 className="account-card__title">{t.store.account.personal_info()}</h2>
                            <div className="account-card__fields">
                                <div className="account-field">
                                    <div className="account-field__icon"><User size={16} /></div>
                                    <div className="account-field__content">
                                        <p className="account-field__label">{t.store.account.full_name()}</p>
                                        <p className="account-field__value">{user.fullName || t.store.account.not_provided()}</p>
                                    </div>
                                </div>
                                <div className="account-field">
                                    <div className="account-field__icon"><Mail size={16} /></div>
                                    <div className="account-field__content">
                                        <p className="account-field__label">{t.store.account.email()}</p>
                                        <p className="account-field__value">{user.email}</p>
                                    </div>
                                </div>
                                <div className="account-field">
                                    <div className="account-field__icon"><Phone size={16} /></div>
                                    <div className="account-field__content">
                                        <p className="account-field__label">{t.store.account.phone()}</p>
                                        <p className="account-field__value">{user.phone || t.store.account.not_provided()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="account-links">
                            <Link to={AppRoutePath.ORDERS} className="account-link-card">
                                <div className="account-link-card__icon account-link-card__icon--orders">
                                    <Package size={22} />
                                </div>
                                <div className="account-link-card__body">
                                    <h3 className="account-link-card__title">{t.store.account.my_orders()}</h3>
                                    <p className="account-link-card__desc">{t.store.account.my_orders_desc()}</p>
                                </div>
                                <ChevronRight size={18} className="account-link-card__arrow" />
                            </Link>

                            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="account-link-card">
                                <div className="account-link-card__icon account-link-card__icon--support">
                                    <MessageCircle size={22} />
                                </div>
                                <div className="account-link-card__body">
                                    <h3 className="account-link-card__title">{t.store.account.contact_support()}</h3>
                                    <p className="account-link-card__desc">{t.store.account.contact_support_desc()}</p>
                                </div>
                                <ChevronRight size={18} className="account-link-card__arrow" />
                            </a>

                            <button onClick={handleLogout} className="account-link-card account-link-card--logout">
                                <div className="account-link-card__icon account-link-card__icon--logout">
                                    <LogOut size={22} />
                                </div>
                                <div className="account-link-card__body">
                                    <h3 className="account-link-card__title">{t.store.nav.logout()}</h3>
                                </div>
                                <ChevronRight size={18} className="account-link-card__arrow" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </StoreLayout>
    );
};

export default AccountPage;
