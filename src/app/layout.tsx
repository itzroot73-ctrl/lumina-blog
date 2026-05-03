import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina — Orange & Black Blog Platform",
  description: "A cinematic, glassmorphic blog platform for artists and creators. Discover, create, and share content in a stunning dark interface. Support artists with 80/20 revenue sharing.",
  keywords: ["Lumina", "Blog", "Glassmorphic", "Dark Theme", "Creative Writing", "Cinematic", "Support Artists"],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
