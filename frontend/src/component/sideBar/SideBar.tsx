import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { t } from '@/core/localized';
import { LogUtils } from '@/core/utils';
import { ic_logo } from '@/assets/images';
import { sidebarBus } from "./SideBarEventBus";
import "./SideBar.css";

export interface SideBarItem {
    title: string;
    href?: string;
    onClick?: () => void;
}

export interface SideBarProps {
    title?: string;
    index: number;
    itemList: SideBarItem[];
    onLogout?: () => void;
}

const SideBar: React.FC<{ props: SideBarProps }> = ({ props }) => {
    const [title, setTitle] = React.useState(props.title || "");

    const [activeIndex, setActiveIndex] = useState(props.index ?? 0);

    const [isExpanded, setExpanded] = useState(true);

    const { pathname } = useLocation();

    // Listen sidebar events
    useEffect(() => {
        const offIndex = sidebarBus.on('sidebar:setIndex', ({ index }) => {
            setActiveIndex(index)
        })

        const offToggle = sidebarBus.on('sidebar:toggle', ({ isExpanded }) => {
            // setExpanded(isExpanded)
        })

        return () => {
            offIndex()
            offToggle()
        }
    }, []);

    // Update active index on route change
    useEffect(() => {
        LogUtils.debug(SideBar.name, title, activeIndex, isExpanded)

        const idx = props.itemList.findIndex(
            item => item.href === pathname
        )
        if (idx >= 0) {
            setActiveIndex(idx)
        }
    }, [pathname])

    return (
        <section className="app-sidebar" aria-label="sidebar">
            <div className="app-sidebar-brand">
                <img
                    className="app-sidebar-logo"
                    src={ic_logo}
                    alt="Store"
                />
            </div>

            <nav className="app-sidebar-menu" aria-label="main menu">
                {props.itemList.map((item, i) => (
                    item.href
                        ?
                        <Link
                            key={i}
                            to={item.href}
                            className={`app-sidebar-item ${i === activeIndex ? "selected" : ""}`}
                            onClick={() => sidebarBus.emit('sidebar:setIndex', { index: i })}
                        >
                            <span className="app-sidebar-item-text">{item.title}</span>
                        </Link>
                        :
                        <a
                            key={i}
                            className={`app-sidebar-item ${i === activeIndex ? "selected" : ""}`}
                            onClick={(e) => {
                                // sidebarBus.emit('sidebar:setIndex', { index: i })

                                if (item.onClick) {
                                    e.preventDefault();
                                    item.onClick();
                                }
                            }}
                        >
                            <span className="app-sidebar-item-text">
                                {item.title}
                            </span>
                        </a>
                ))}
            </nav>

            <div className="app-sidebar-bottom">
                <a
                    className="app-sidebar-item app-sidebar-logout-item"
                    onClick={props.onLogout}
                >
                    <span className="app-sidebar-item-text">
                        {t.common.logout()}
                    </span>
                </a>
            </div>
        </section>
    );
};

export default SideBar;