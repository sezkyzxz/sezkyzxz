import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import "./portfolio.css";
import "aos/dist/aos.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sezky.studio'),
  title: {
    default: "SEZKY — Branding Studio | Brand Identity & Package Design",
    template: "%s | SEZKY Studio",
  },
  description:
    "Elevate your brand with custom identity and package design. Showcase your story through bold visuals and strategic design solutions.",
  keywords: [
    "Brand Identity",
    "Package Design",
    "Desain Kemasan",
    "Desain Logo",
    "Branding Studio Jakarta",
    "SEZKY Studio",
    "UI/UX Design",
    "Mockup Design",
    "Creative Studio",
  ],
  authors: [{ name: "SEZKY Studio", url: "https://sezky.studio" }],
  creator: "SEZKY",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://sezky.studio",
    title: "SEZKY — Branding Studio | Brand Identity & Package Design",
    description:
      "Tingkatkan nilai bisnis Anda dengan desain identitas merek dan kemasan kustom. Visual berani, strategis, dan berdampak nyata.",
    siteName: "SEZKY Studio",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEZKY — Branding Studio & Package Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEZKY — Branding Studio | Brand Identity & Package Design",
    description:
      "Elevate your brand with custom identity and package design. Bold visuals & tactile packaging experiences.",
    images: ["/assets/images/og-image.png"],
    creator: "@szkyyzxz",
  },
  icons: {
    icon: "/assets/icons/favicon.svg",
    apple: "/assets/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
