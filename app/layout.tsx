import type { Metadata } from "next";
import { Oxanium, Space_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "JAY — Fullstack Developer",
  description: "Fullstack developer specializing in web, mobile, AI automations and ecommerce. Based in Mongolia.",
  keywords: ["fullstack developer", "Next.js", "mobile developer", "AI automation", "ecommerce"],
  openGraph: {
    title: "JAY — Fullstack Developer",
    description: "Fullstack developer specializing in web, mobile, AI automations and ecommerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
