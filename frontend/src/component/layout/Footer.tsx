"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { MessageCircle } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const FACEBOOK_URL = "https://www.facebook.com/xh.456789";
const MESSENGER_URL = "https://m.me/xh.456789";

const Footer: React.FC = () => {
    useLanguage();
    return (
        <footer className="store-footer">
            <div className="container-page store-footer__inner">
                <div className="store-footer__grid">
                    {/* Brand */}
                    <div>
                        <Link to={AppRoutePath.HOME} className="store-footer__brand-link">
                            <span className="store-footer__brand-name">
                                Store<span className="store-footer__brand-accent">Amazon</span>
                            </span>
                        </Link>
                        <p className="store-footer__brand-desc">{t.store.footer.desc()}</p>
                        <div className="store-footer__socials">
                            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="store-footer__social-btn store-footer__social-btn--fb">
                                <FacebookIcon size={14} /> Facebook
                            </a>
                            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="store-footer__social-btn store-footer__social-btn--msg">
                                <MessageCircle size={14} /> Messenger
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="store-footer__col-title">{t.store.footer.products_col()}</h4>
                        <ul className="store-footer__col-list">
                            <li><Link to={`${AppRoutePath.PRODUCTS}?sort=newest`} className="store-footer__col-link">{t.store.footer.new_arrivals()}</Link></li>
                            <li><Link to={AppRoutePath.PRODUCTS} className="store-footer__col-link">{t.store.footer.all_products()}</Link></li>
                            <li><Link to={AppRoutePath.CATEGORIES} className="store-footer__col-link">{t.store.footer.categories()}</Link></li>
                            <li><Link to={AppRoutePath.BRANDS} className="store-footer__col-link">{t.store.footer.brands()}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="store-footer__col-title">{t.store.footer.support_col()}</h4>
                        <ul className="store-footer__col-list">
                            <li><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="store-footer__col-link">{t.store.footer.facebook_page()}</a></li>
                            <li><a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="store-footer__col-link">{t.store.footer.messenger_contact()}</a></li>
                            <li><span className="store-footer__col-text">{t.store.footer.business_hours()}</span></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="store-footer__col-title">{t.store.footer.company_col()}</h4>
                        <ul className="store-footer__col-list">
                            <li><span className="store-footer__col-text">{t.store.footer.legal_notice()}</span></li>
                            <li><span className="store-footer__col-text">{t.store.footer.privacy_policy()}</span></li>
                            <li><span className="store-footer__col-text">{t.store.footer.terms()}</span></li>
                        </ul>
                    </div>
                </div>

                <div className="store-footer__bottom">
                    <p className="store-footer__copyright">{t.store.footer.copyright()}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
