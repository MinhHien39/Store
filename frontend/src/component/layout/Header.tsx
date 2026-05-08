"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import {
    LogOut,
    Menu,
    MessageCircle,
    Search,
    ShoppingBag,
    User,
    X,
    Zap,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";
import { useCart } from "@/provider/CartProvider";
import { useAuthContext } from "@/provider/AuthContextProvider";
import { useGlobalUI } from "@/provider/GlobalUIProvider";

const MESSENGER_URL = "https://m.me/xh.456789";

const Header: React.FC = () => {
    useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { itemCount } = useCart();
    const { isAuthenticated, onLogout } = useAuthContext();
    const { showDialog } = useGlobalUI();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleLogout = () => {
        showDialog({
            content: t.confirm.logout(),
            onAgree: () => {
                onLogout();
                navigate(AppRoutePath.HOME);
            },
            onClose: () => {},
        });
    };

    const navItems = [
        { label: t.store.nav.home(), path: AppRoutePath.HOME },
        { label: t.store.nav.products(), path: AppRoutePath.PRODUCTS },
        { label: t.store.nav.categories(), path: AppRoutePath.CATEGORIES },
        { label: t.store.nav.brands(), path: AppRoutePath.BRANDS },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const keyword = searchQuery.trim();
        if (!keyword) return;
        navigate(`${AppRoutePath.PRODUCTS}?keyword=${encodeURIComponent(keyword)}`);
        setSearchQuery("");
        setIsMobileSearchOpen(false);
        setIsMobileMenuOpen(false);
    };

    const isActivePath = (path: string) => {
        if (path === AppRoutePath.HOME) return location.pathname === path;
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <>
        <header className="store-header">
            {/* Top bar */}
            <div className="store-header__topbar">
                <div className="container-page store-header__topbar-inner">
                    <div className="store-header__topbar-left">
                        <Zap size={15} />
                        <span>{t.store.nav.banner().replace("🎉 ", "")}</span>
                    </div>
                    <a
                        href={MESSENGER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="store-header__topbar-contact"
                    >
                        <MessageCircle size={14} />
                        {t.store.nav.contact()}
                    </a>
                </div>
            </div>

            {/* Main row */}
            <div className="container-page store-header__main">
                {/* Logo */}
                <Link
                    to={AppRoutePath.HOME}
                    className="store-header__logo"
                    aria-label="Store home"
                >
                    <span className="store-header__logo-icon">
                        <ShoppingBag size={22} />
                    </span>
                    <span className="store-header__logo-text">
                        Store<span className="store-header__logo-accent"></span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="store-header__nav">
                    {navItems.map((item) => {
                        const active = isActivePath(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`store-header__nav-link ${active ? "store-header__nav-link--active" : ""}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop search */}
                <form onSubmit={handleSearch} className="store-header__search">
                    <div className="search-input-wrapper">
                        <Search size={17} className="search-icon" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.store.nav.search_placeholder()}
                            aria-label={t.store.nav.search()}
                            className="input !rounded-full !border-slate-200 !bg-slate-50"
                        />
                    </div>
                </form>

                {/* Actions */}
                <div className="store-header__actions">
                    <button
                        onClick={() => setIsMobileSearchOpen((v) => !v)}
                        className="icon-btn store-header__search-toggle"
                        aria-label={t.store.nav.search()}
                    >
                        <Search size={20} />
                    </button>

                    <a
                        href={MESSENGER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="store-header__messenger"
                    >
                        <MessageCircle size={17} />
                        {t.store.nav.contact()}
                    </a>

                    <Link
                        to={AppRoutePath.CART}
                        className="store-header__cart"
                        aria-label={t.store.nav.cart()}
                    >
                        <ShoppingBag size={20} />
                        {itemCount > 0 && (
                            <span className="store-header__cart-badge">
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to={AppRoutePath.ACCOUNT}
                                className="store-header__user"
                                aria-label={t.store.nav.account()}
                            >
                                <User size={20} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="icon-btn store-header__logout"
                                aria-label={t.store.nav.logout()}
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link
                            to={AppRoutePath.LOGIN}
                            className="store-header__user"
                            aria-label={t.store.nav.login()}
                        >
                            <User size={20} />
                        </Link>
                    )}

                    <div className="store-header__lang">
                        <LanguageSwitcher variant="icon-label" />
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        className="icon-btn store-header__menu-toggle"
                        aria-label={t.store.nav.menu()}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile search */}
            {isMobileSearchOpen && (
                <div className="store-header__mobile-search motion-fade-in">
                    <form onSubmit={handleSearch} className="search-input-wrapper">
                        <Search size={17} className="search-icon" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.store.nav.search_placeholder()}
                            aria-label={t.store.nav.search()}
                            className="input !rounded-full"
                            autoFocus
                        />
                    </form>
                </div>
            )}
        </header>

            {/* Mobile menu — must be outside <header> because backdrop-filter creates a containing block */}
            {isMobileMenuOpen && (
                <div className="store-header__mobile-overlay">
                    <div className="store-header__mobile-drawer motion-fade-up">
                        <div className="store-header__mobile-drawer-top">
                            <div>
                                <p className="store-header__mobile-drawer-brand">Store</p>
                                <p className="store-header__mobile-drawer-desc">Clean shopping workspace</p>
                            </div>
                            <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label={t.common.close()}>
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="store-header__mobile-nav">
                            {navItems.map((item) => {
                                const active = isActivePath(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`store-header__mobile-link ${active ? "store-header__mobile-link--active" : ""}`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="store-header__mobile-actions">
                            <a
                                href={MESSENGER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="base-button base-button--contained"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <MessageCircle size={18} />
                                {t.store.nav.messenger()}
                            </a>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={AppRoutePath.ACCOUNT}
                                        className="base-button base-button--outline"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User size={18} />
                                        {t.store.nav.account()}
                                    </Link>
                                    <button
                                        className="base-button base-button--outline"
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    >
                                        <LogOut size={18} />
                                        {t.store.nav.logout()}
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to={AppRoutePath.LOGIN}
                                    className="base-button base-button--outline"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    {t.store.nav.login()}
                                </Link>
                            )}
                            <LanguageSwitcher variant="icon-label" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
