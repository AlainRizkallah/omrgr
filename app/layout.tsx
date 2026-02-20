import type { Metadata } from "next";
import "./globals.css";
import { getHome } from "@/lib/sanity/data";
import { eczarFont, corbertFont } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "OMRGR",
    template: "%s | OMRGR",
  },
  description: "OMRGR — portfolio and galleries. Works organized in series, from chairs and furniture to interior design.",
  keywords: ["OMRGR", "portfolio", "galleries", "works", "chairs", "furniture", "interior design"],
  openGraph: {
    title: "OMRGR",
    description: "OMRGR — portfolio and galleries. Works organized in series.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OMRGR",
    description: "OMRGR — portfolio and galleries. Works organized in series.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SITE_FONT_CLASS: Record<string, string> = {
  serif: "font-serif-editorial",
  sans: "font-sans",
  "hal-timezone": "font-hal-timezone",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let siteFontClass = eczarFont.className;
  try {
    const home = await getHome();
    siteFontClass =
      home.siteFont === "eczar"
        ? eczarFont.className
        : home.siteFont === "corbert"
          ? corbertFont.className
          : SITE_FONT_CLASS[home.siteFont] ?? eczarFont.className;
  } catch {
    // no Sanity data yet
  }

  return (
    <html lang="en">
      <body
        className={`${siteFontClass} min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
