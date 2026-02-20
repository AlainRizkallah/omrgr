import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSeriesList, getHome, getInfoNavLinks } from "@/lib/sanity/data";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let seriesList: Array<{ slug: string; title: string; galleries: Array<{ slug: string; title: string; seriesSlug: string; imageCount?: number }> }> = [];
  let siteTitle = "OMRGR";
  let infoNavLinks: Array<{ href: string; label: string }> = [
    { href: "/info/about", label: "About" },
    { href: "/info/press", label: "Press" },
  ];
  try {
    const [list, home, navLinks] = await Promise.all([getSeriesList(), getHome(), getInfoNavLinks()]);
    seriesList = list;
    siteTitle = home.siteTitle || "OMRGR";
    infoNavLinks = navLinks;
  } catch {
    // no Sanity data yet
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header seriesList={seriesList} siteTitle={siteTitle} infoNavLinks={infoNavLinks} />
      <main className="min-h-0 flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
