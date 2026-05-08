import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

export interface PathNavigationItem {
    title: string;
    link?: string;
    onClick?: () => void;
}

export interface PathNavigationProps {
    dataList: PathNavigationItem[];
    styles?: React.CSSProperties;
}

const NavigationItem: React.FC<{ item: PathNavigationItem; isLastItem: boolean }> = ({ item, isLastItem }) => {
    const textClassName = `path-navigation--text ${isLastItem ? "path-navigation--text-last" : ""}`;
    if (isLastItem || (!item.onClick && !item.link)) {
        return <span className={textClassName}>{item.title}</span>;
    }

    if (item.onClick) {
        return (
            <button
                type="button"
                className={`${textClassName} path-navigation--button`}
                onClick={item.onClick}
            >
                {item.title}
            </button>
        );
    }

    return (
        <Link to={item.link || '#'} className={textClassName}>
            {item.title}
        </Link>
    );
};

const PathNavigation: React.FC<PathNavigationProps> = ({ dataList, styles }) => {
    return (
        <div className="path-navigation" style={styles} aria-label="breadcrumb">
            <ol className="path-navigation--list">
                {
                    dataList.map((item: PathNavigationItem, index) => {
                        const isLastItem = index === dataList.length - 1;
                        const content = <NavigationItem item={item} isLastItem={isLastItem} />;

                        return (
                            <li 
                                key={`${item.title}-${index}`} 
                                className="path-navigation--item">
                                {content}

                                {
                                    !isLastItem 
                                    && 
                                    <span className="path-navigation--separator">›</span>
                                }
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default PathNavigation;

/* Example:

import PathNavigation, { PathNavigationItem } from "@/component/pathNavigation";

const navItems: PathNavigationItem[] = [
  {
    title: "システム管理者トップ",
    link: "/admin"
  },
  {
    title: "企業一覧",
    onClick: () => window.history.back()
  },
  {
    title: "企業登録"
  }
];

<PathNavigation
  dataList={navItems}
  styles={{}}
/>
*/