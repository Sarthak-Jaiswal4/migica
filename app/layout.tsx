import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppInitializer } from "@/components/AppInitializer";
import { SmoothScrolling } from "@/components/SmoothScrolling";

export const viewport: Viewport = {
  themeColor: "#F6F4F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Silver Star | Artisanal Candles & Luxury Goods",
    template: "%s | Silver Star",
  },
  description: "Hand-poured artisanal candles and premium luxury goods designed to bring a touch of magic to your everyday life.",
  keywords: ["candles", "artisanal", "luxury goods", "scarves", "jewelry", "Silver Star", "magica"],
  authors: [{ name: "Silver Star" }],
  creator: "Silver Star",
  publisher: "Silver Star",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Silver Star | Artisanal Candles & Luxury Goods",
    description: "Hand-poured artisanal candles and premium luxury goods designed to bring a touch of magic to your everyday life.",
    siteName: "Silver Star",
    images: [
      {
        url: "/10.jpeg",
        width: 1200,
        height: 630,
        alt: "Silver Star Artisanal Candles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver Star | Artisanal Candles & Luxury Goods",
    description: "Hand-poured artisanal candles and premium luxury goods designed to bring a touch of magic to your everyday life.",
    images: ["/10.jpeg"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Silver Star',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/shop/all?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Silver Star',
      url: baseUrl,
      logo: `${baseUrl}/10.jpeg`, // Use a real logo URL
      sameAs: [
        'https://instagram.com/silverstar',
        'https://twitter.com/silverstar',
        'https://facebook.com/silverstar'
      ]
    }
  ];

  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{ fontFamily: "'Switzer', sans-serif, 'style" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrolling>
          {children}
          <AppInitializer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
