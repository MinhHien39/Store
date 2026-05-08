"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingMessenger from "@/component/common/FloatingMessenger";

interface StoreLayoutProps {
    children: React.ReactNode;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
    return (
        <div className="store-layout">
            <Header />
            <main className="store-layout__main">{children}</main>
            <Footer />
            <FloatingMessenger />
        </div>
    );
};

export default StoreLayout;
