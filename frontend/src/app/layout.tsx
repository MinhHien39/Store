import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import AdSenseScript from "@/component/common/AdSenseScript";
import { ADSENSE_CLIENT, hasAdsenseClient } from "@/core/adsense";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/core/site";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-rubik",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "vi_VN",
  },
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {hasAdsenseClient && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        )}
        <AdSenseScript />
      </head>
      <body className={`${rubik.variable} ${nunitoSans.variable} ${nunitoSans.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
