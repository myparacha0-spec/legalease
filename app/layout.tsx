import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://legalease.example.com"),
  title: {
    default: "LegalEase — Modern Legal Help, Without the Runaround",
    template: "%s — LegalEase",
  },
  description:
    "LegalEase connects people with verified lawyers, plain-language legal guidance, and an AI assistant that helps you understand your rights — so you can act with confidence.",
  keywords: [
    "find a lawyer",
    "legal help",
    "legal assistant",
    "legal resources",
    "lawyer directory",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LegalEase",
    title: "LegalEase — Modern Legal Help, Without the Runaround",
    description:
      "Verified lawyers, plain-language guidance, and an AI assistant built to demystify the law.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}