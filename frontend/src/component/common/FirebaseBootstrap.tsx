"use client";

import { useEffect } from "react";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  shouldLoadFirebaseAnalyticsOnClient,
} from "@/core/firebase";
import { trackException } from "@/core/firebaseAnalytics";

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

    const handleError = (event: ErrorEvent) => {
      const message =
        event.error instanceof Error
          ? event.error.message
          : event.message || "Unknown script error";
      void trackException(`error:${message}`, false);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason || "Unknown rejection");
      void trackException(`unhandledrejection:${reason}`, false);
    };

    void bootstrapFirebase();
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      mounted = false;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
