import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import AdSenseScript from "@/component/common/AdSenseScript";
import { ADSENSE_CLIENT, isAdsenseConfigured } from "@/core/adsense";
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
  title: "Store",
  description: "Your one-stop shop for the best products at great prices",
  icons: {
    icon: "/favicon.png",
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
        {isAdsenseConfigured && (
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
