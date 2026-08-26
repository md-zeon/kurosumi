import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const siteUrl = "https://kurosumi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kurosumi - Local-first Markdown Notes",
    template: "%s | Kurosumi",
  },
  description:
    "A beautiful, local-first Markdown note-taking app. Write in Markdown with live preview, syntax highlighting, and export to PDF/DOCX. All data stays in your browser.",
  keywords: [
    "markdown",
    "notes",
    "note-taking",
    "local-first",
    "offline",
    "text editor",
    "PWA",
    "markdown editor",
    "code editor",
    "productivity",
    "privacy",
    "open source",
  ],
  authors: [{ name: "md-zeon" }],
  creator: "md-zeon",
  publisher: "md-zeon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Kurosumi - Local-first Markdown Notes",
    description:
      "A beautiful, local-first Markdown note-taking app. Write in Markdown with live preview, syntax highlighting, and export to PDF/DOCX. All data stays in your browser.",
    siteName: "Kurosumi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kurosumi - Local-first Markdown Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurosumi - Local-first Markdown Notes",
    description:
      "A beautiful, local-first Markdown note-taking app. Write in Markdown with live preview, syntax highlighting, and export to PDF/DOCX.",
    images: ["/og-image.png"],
    creator: "@md-zeon",
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kurosumi",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A090F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A090F] text-[#EFEFE6]">
        <ServiceWorkerRegistration />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
