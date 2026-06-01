import type { MetadataRoute } from "next";
import { SITE_PATHS, SITE_URL } from "@/core/site";

const PUBLIC_PATHS = [
  SITE_PATHS.home,
  SITE_PATHS.products,
  SITE_PATHS.categories,
  SITE_PATHS.brands,
  SITE_PATHS.about,
  SITE_PATHS.contact,
  SITE_PATHS.privacyPolicy,
  SITE_PATHS.terms,
  SITE_PATHS.login,
  SITE_PATHS.register,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
