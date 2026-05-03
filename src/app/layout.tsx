import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina.blog";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lumina Blog — Discover Lumina Articles & Stories That Illuminate",
    template: "Lumina Article | %s — Explore the Future",
  },
  description:
    "Lumina Blog is a cinematic glassmorphic article platform where creators publish Lumina Articles and videos. Discover insightful content on design, technology, and creative craft. Support artists with 80/20 revenue sharing.",
  keywords: [
    "Lumina",
    "Lumina Article",
    "Lumina Blog",
    "Article Platform",
    "Creative Writing",
    "Glassmorphic",
    "Dark Theme",
    "Cinematic",
    "Support Artists",
    "Creator Platform",
    "Blog Platform",
    "Publish Articles",
    "Creator Economy",
    "80/20 Revenue Split",
  ],
  authors: [{ name: "Lumina", url: SITE_URL }],
  creator: "Lumina",
  publisher: "Lumina",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Lumina Blog",
    title: "Lumina Blog — Discover Lumina Articles & Stories That Illuminate",
    description:
      "A cinematic glassmorphic article platform where creators publish Lumina Articles and videos. Support artists with 80/20 revenue sharing.",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lumina Blog — Article Platform for Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Blog — Discover Lumina Articles & Stories That Illuminate",
    description:
      "A cinematic glassmorphic article platform. Publish Lumina Articles, support artists with 80/20 revenue sharing.",
    images: [`${SITE_URL}/logo.png`],
    creator: "@luminablog",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.png",
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lumina Blog",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Lumina Blog is a cinematic glassmorphic article platform for creators to publish articles and videos with 80/20 revenue sharing.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: SITE_URL,
    },
  };

  // JSON-LD Structured Data for WebSite (enables Google Search Sitelinks)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lumina Blog",
    url: SITE_URL,
    description:
      "Discover Lumina Articles and videos on technology, design, art, and creative craft.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
