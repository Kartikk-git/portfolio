import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kartikk-git.github.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/styleguide", "/styleguide/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
