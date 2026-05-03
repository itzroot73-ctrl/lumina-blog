import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina.blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/#discover`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#features`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/#about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic article pages — fetch from API
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      `http://localhost:${process.env.PORT || 3000}`;
    const res = await fetch(`${baseUrl}/api/posts?postType=article`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (res.ok) {
      const data = await res.json();
      const posts = data.posts || [];
      dynamicPages = posts.map(
        (post: {
          id: string;
          slug?: string;
          updatedAt: string;
          createdAt: string;
          category: string;
        }) => ({
          url: `${SITE_URL}/?view=post&id=${post.id}`,
          lastModified: new Date(post.updatedAt || post.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })
      );
    }
  } catch {
    // Fallback: no dynamic pages if API unreachable during build
    console.warn("Sitemap: Could not fetch posts for dynamic URLs");
  }

  return [...staticPages, ...dynamicPages];
}
