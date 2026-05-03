'use client';

import type { Post } from '@/lib/store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumina.blog';

interface ArticleJsonLdProps {
  post: Post;
}

export default function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const isVideo = post.postType === 'video' || !!post.videoUrl || post.category === 'Video';

  const schema = {
    '@context': 'https://schema.org',
    '@type': isVideo ? 'VideoObject' : 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.thumbnail ? (post.thumbnail.startsWith('http') ? post.thumbnail : `${SITE_URL}${post.thumbnail}`) : `${SITE_URL}/logo.png`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE_URL}/?view=profile&username=${post.author.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lumina Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    url: `${SITE_URL}/?view=post&id=${post.id}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/?view=post&id=${post.id}`,
    },
    wordCount: post.content?.split(/\s+/).length || 0,
    timeRequired: `PT${post.readingTime}M`,
    genre: post.category,
    keywords: `Lumina Article, ${post.category}, ${post.title}`,
    ...(isVideo && post.videoUrl
      ? {
          contentUrl: post.videoUrl.startsWith('http') ? post.videoUrl : `${SITE_URL}${post.videoUrl}`,
          embedUrl: `${SITE_URL}/?view=post&id=${post.id}`,
          duration: `PT${post.readingTime}M`,
        }
      : {}),
  };

  // Also add BreadcrumbList for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category,
        item: `${SITE_URL}/?category=${post.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/?view=post&id=${post.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
