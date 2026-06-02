"use client";

import { useEffect } from "react";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  shouldLoadFirebaseAnalyticsOnClient,
} from "@/core/firebase";

export default function FirebaseBootstrap() {
  useEffect(() => {
    let mounted = true;

    const bootstrapFirebase = async () => {
      const app = getFirebaseApp();

      if (!app || !isFirebaseConfigured || !shouldLoadFirebaseAnalyticsOnClient()) {
        return;
      }

      try {
        const { getAnalytics, isSupported } = await import("firebase/analytics");
        const supported = await isSupported();

        if (!mounted || !supported) return;
        getAnalytics(app);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Firebase analytics initialization skipped.", error);
        }
      }
    };

    void bootstrapFirebase();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
