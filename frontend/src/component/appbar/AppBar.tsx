import React, { useState } from 'react';
import { DeviceUtils } from '@/core/utils';
import {
    ic_menu,
    ic_close,
    ic_logo
} from '@/assets/images';
import "./AppBar.css";

export type DrawerItem = {
    label: string;
    icon: string;
    onClick?: () => void;
    subItems: DrawerItem[];
    isHidden?: boolean;
};

export type AppBarConfig = {
    isShow: boolean;
    index: number;
    subIndex: number | null,
    userName: string;
    menuItems: DrawerItem[];
    onLogout: () => void;
    onDrawerOpen: (isOpen: boolean) => void;
};

const AppBar: React.FC<{ config: AppBarConfig }> = ({ config }) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getTitle = (): string => {
        const index = config.index;
        const subIndex = config.subIndex;
        const menuItem = config.menuItems[index];

        const hasSubIndex = menuItem.subItems?.length > 0
            && subIndex !== undefined
            && subIndex !== null
            && subIndex >= 0
            && subIndex < menuItem.subItems?.length;

        if (hasSubIndex) {
            return menuItem.subItems[subIndex].label;
        }
        return menuItem.label;
    }

    const setDrawerOpen = (isOpen: boolean) => {
        setIsDrawerOpen(isOpen);
        config.onDrawerOpen(isOpen);
    }

    const isMobileScreen = DeviceUtils.isMobileScreen()
    return (
        <>
            {/* App Bar */}
            <div className="app-bar elevation-2" style={{ display: `${config.isShow ? "flex" : "none"}` }}>
                {
                    <button
                        className="app-bar--menu-button"
                        onClick={() => setDrawerOpen(!isDrawerOpen)}
                    >
                        <img
                            className='app-bar--menu'
                            src={isDrawerOpen ? ic_close : ic_menu}
                            width={28}
                            height={28}
                        />
                    </button>
                }
                <div className="app-bar--title">{getTitle()}</div>
                <div className="user-bar--user-info">
                    <div className="app-bar--username">
                        <span>{config.userName}</span>
                        <span>ログイン中</span>
                    </div>
                    <button
                        className="app-bar--logout-button"
                        onClick={() => config.onLogout()}>ログアウト
                    </button>
                </div>
            </div>

            {/* Drawer Menu */}
            <div
                className={`app-drawer ${isDrawerOpen ? 'open' : ''}`}
                style={{ display: `${config.isShow ? "block" : "none"}` }}
            >
                <div className="app-drawer-header d-flex-center z-10">
                    <img className="object-fit-contain app-drawer-logo" src={ic_logo} />
                </div>
                <ul className="app-drawer-list">
                    {config.menuItems.map((item, index) => (
                        !item.isHidden && (
                            <div key={index}>
                                <li
                                    className={`app-drawer-item ${(index === config.index && config.subIndex === null) ? 'selected' : ''}`}
                                    onClick={() => {
                                        item.onClick?.();
                                        if (isMobileScreen) {
                                            setDrawerOpen(false);
                                        }
                                        setDrawerOpen(false);
                                        /* 
                                        if (item.subItems?.length) {
                                            setExpandedIndex(expandedIndex === index ? null : index);
                                        } else {
                                            item.onClick?.();
                                        }
                                        */
                                    }}
                                >
                                    {
                                        item.icon
                                        &&
                                        <img
                                            src={item.icon}
                                            className="app-drawer-icon"
                                            alt={item.label}
                                        />
                                    }
                                    <span>{item.label}</span>

                                    {
                                        /*    
                                        {item.subItems?.length > 0 && (
                                            <span className="app-drawer-item-arrow">{expandedIndex === index ? '▲' : '▼'}</span>
                                        )}
                                        */
                                    }

                                </li>

                                {
                                    item.subItems?.length > 0
                                    &&
                                    (
                                        <ul className="app-drawer-sublist">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li
                                                    key={`${index}-${subIndex}`}
                                                    className={`app-drawer-subItem ${config.subIndex == subIndex ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        subItem.onClick?.();
                                                        if (isMobileScreen) {
                                                            setDrawerOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <span>{`${subItem.label}`}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }
                            </div>
                        )))}
                    <div className='app-drawer-logout-button'>
                        <button
                            className="app-bar--logout-button"
                            onClick={() => {
                                config.onLogout();
                                setDrawerOpen(false);
                            }}>ログアウト
                        </button>
                    </div>
                </ul>
            </div>

            {
                isDrawerOpen
                &&
                <div
                    className="app-drawer-backdrop"
                    onClick={() => {
                        setIsDrawerOpen(false);
                        config.onDrawerOpen(false);
                    }}
                />
            }

        </>
    );
};

export default AppBar;
