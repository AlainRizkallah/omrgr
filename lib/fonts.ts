import { Eczar } from "next/font/google";
import localFont from "next/font/local";

/**
 * Optimized font loading via next/font to prevent FOUT (flash of unstyled text).
 * These fonts are preloaded and their CSS is injected by Next.js.
 */
export const eczarFont = Eczar({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const corbertFont = localFont({
  src: [
    { path: "../public/fonts/Corbert-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Corbert-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Corbert-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Corbert-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Corbert-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Corbert-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-corbert",
});
