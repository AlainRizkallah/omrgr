import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Your Name — Work",
  description: "Minimal photo-first portfolio.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className={`${geist.className} font-sans flex flex-col min-h-screen overflow-x-hidden`}>
        <Header />
        <main className="flex-1 w-full min-w-0 overflow-x-hidden max-w-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
