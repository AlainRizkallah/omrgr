import type { Metadata } from "next";
import "./globals.css";
import { getHome } from "@/lib/sanity/data";
import { eczarFont, corbertFont } from "@/lib/fonts";
import { getBaseUrl } from "@/lib/site-url";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OMRGR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMRGR",
    description: "OMRGR — portfolio and galleries. Works organized in series.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "OMRGR",
      url: baseUrl,
      sameAs: ["https://www.instagram.com/omrgr_/"],
    },
    {
      "@type": "WebSite",
      name: "OMRGR",
      url: baseUrl,
      publisher: { "@type": "Organization", name: "OMRGR" },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
