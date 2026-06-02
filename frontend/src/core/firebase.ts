import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";

const normalize = (value?: string): string => (value || "").trim();
const isAnalyticsFlagEnabled = normalize(
  process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED
).toLowerCase() !== "false";

const firebaseConfig: FirebaseOptions = {
  apiKey: normalize(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: normalize(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: normalize(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: normalize(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || undefined,
  messagingSenderId:
    normalize(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || undefined,
  appId: normalize(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId:
    normalize(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) || undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

let cachedApp: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) return null;
  if (cachedApp) return cachedApp;

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
};

export const shouldLoadFirebaseAnalyticsOnClient = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!isAnalyticsFlagEnabled) return false;
  if (!isFirebaseConfigured) return false;
  if (!firebaseConfig.measurementId) return false;
  return !LOCAL_HOSTS.has(window.location.hostname);
};

export { firebaseConfig };
