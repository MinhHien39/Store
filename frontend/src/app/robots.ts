import type { MetadataRoute } from "next";
import { SITE_URL } from "@/core/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Google-adstxt", "Mediapartners-Google", "Googlebot"],
        allow: ["/", "/ads.txt"],
        disallow: ["/admin", "/admin/", "/api/", "/cart", "/checkout", "/account"],
      },
      {
        userAgent: "*",
        allow: ["/", "/ads.txt"],
        disallow: ["/admin", "/admin/", "/api/", "/cart", "/checkout", "/account"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
