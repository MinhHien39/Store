"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/core/firebaseAnalytics";

const FirebaseRouteAnalytics: React.FC = () => {
    const location = useLocation();
    const lastTrackedPath = useRef("");

    useEffect(() => {
        if (location.pathname.startsWith("/admin")) return;
        const nextPath = `${location.pathname}${location.search}`;
        if (lastTrackedPath.current === nextPath) return;
        lastTrackedPath.current = nextPath;

        void trackPageView(location.pathname, location.search);
    }, [location.pathname, location.search]);

    return null;
};

export default FirebaseRouteAnalytics;
