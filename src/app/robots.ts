import type { MetadataRoute } from "next";

// Not an access control — protection comes from Vercel Authentication (docs/SECURITY.md).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
