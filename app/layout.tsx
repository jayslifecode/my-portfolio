import type { Metadata } from "next";
import { Oxanium, Space_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { Analytics } from "@vercel/analytics/next";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const SITE_URL = "https://jayslifecode.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JAY — Fullstack Developer",
    template: "%s | JAY",
  },
  description:
    "Fullstack developer based in Mongolia — building fast web apps, mobile experiences, AI automations, and ecommerce solutions with Next.js, React Native, and modern tooling.",
  keywords: [
    "fullstack developer",
    "Next.js developer",
    "React developer",
    "React Native",
    "mobile developer",
    "AI automation",
    "ecommerce developer",
    "web developer Mongolia",
    "JAY developer",
    "TypeScript",
    "freelance developer",
  ],
  authors: [{ name: "JAY", url: SITE_URL }],
  creator: "JAY",
  publisher: "JAY",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "JAY — Fullstack Developer",
    description:
      "Fullstack developer based in Mongolia — web, mobile, AI automations, and ecommerce.",
    url: SITE_URL,
    siteName: "JAY Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "JAY — Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JAY — Fullstack Developer",
    description:
      "Fullstack developer based in Mongolia — web, mobile, AI automations, and ecommerce.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} ${spaceMono.variable}`}>
      <body>
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
