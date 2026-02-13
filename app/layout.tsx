import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Minimal showcase site",
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
