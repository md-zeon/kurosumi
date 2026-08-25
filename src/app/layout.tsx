import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kurosumi - Local-first Markdown Notes",
  description: "A beautiful, local-first Markdown note-taking app. Write in Markdown with live preview, and everything stays in your browser.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0A090F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A090F] text-[#EFEFE6]">{children}</body>
    </html>
  );
}
