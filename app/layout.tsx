/**
 * Root layout: global styles, thin header, and main content area (flex so collection pages can fill height).
 */
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "OMRGR",
  description: "Minimal photo gallery",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="min-h-0 flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
