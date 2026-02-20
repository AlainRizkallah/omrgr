import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSeriesList, getHome, getInfoNavLinks } from "@/lib/sanity/data";

const SITE_FONT_CLASS: Record<string, string> = {
  corbert: "font-corbert",
  eczar: "font-eczar",
  serif: "font-serif-editorial",
  sans: "font-sans",
  "hal-timezone": "font-hal-timezone",
};

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let seriesList: Array<{ slug: string; title: string; galleries: Array<{ slug: string; title: string; seriesSlug: string; imageCount?: number }> }> = [];
  let siteTitle = "OMRGR";
  let siteFontClass = "font-eczar";
  let infoNavLinks: Array<{ href: string; label: string }> = [
    { href: "/info/about", label: "About" },
    { href: "/info/press", label: "Press" },
  ];
  try {
    const [list, home, navLinks] = await Promise.all([getSeriesList(), getHome(), getInfoNavLinks()]);
    seriesList = list;
    siteTitle = home.siteTitle || "OMRGR";
    siteFontClass = SITE_FONT_CLASS[home.siteFont] ?? "font-eczar";
    infoNavLinks = navLinks;
  } catch {
    // no Sanity data yet
  }

  return (
    <div className={`${siteFontClass} flex min-h-screen flex-col`}>
      <Header seriesList={seriesList} siteTitle={siteTitle} infoNavLinks={infoNavLinks} />
      <main className="min-h-0 flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
