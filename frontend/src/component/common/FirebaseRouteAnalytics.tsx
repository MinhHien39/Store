"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/core/firebaseAnalytics";

const FirebaseRouteAnalytics: React.FC = () => {
    const location = useLocation();
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (location.pathname.startsWith("/admin")) return;

        void trackPageView(location.pathname, location.search);
    }, [location.pathname, location.search]);

    return null;
};

export default FirebaseRouteAnalytics;
