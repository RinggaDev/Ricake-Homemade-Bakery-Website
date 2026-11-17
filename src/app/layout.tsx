import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: "#3A1D10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ricakebakery.com"),
  title: `${siteConfig.name} — Homemade Bakery | ${siteConfig.brandTagline}`,
  description: siteConfig.shortDescription,
  keywords: ["Ricake", "Homemade Bakery", "Churros Frozen", "Custom Bolu", "Fudgy Brownies", "Soft Cookies", "Bakery Jakarta Citayam"],
  authors: [{ name: "Ricake Homemade Bakery" }],
  openGraph: {
    title: `${siteConfig.name} — Homemade Bakery`,
    description: siteConfig.shortDescription,
    url: "https://ricakebakery.com",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-bakes.jpg",
        width: 1200,
        height: 630,
        alt: "Ricake Artisan Bakes",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/ricake-logo.png",
    apple: "/images/ricake-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-warm-ivory text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
