import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased">
        {children}
      </body>
    </html>
  );
}
