const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// robots.txt : les pages privées ne sont pas explorées.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/shopCart", "/orders", "/login", "/register"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
