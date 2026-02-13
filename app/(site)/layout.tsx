import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSeriesList, getHome } from "@/lib/sanity/data";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let seriesList: Array<{ slug: string; title: string; galleries: Array<{ slug: string; title: string; seriesSlug: string; imageCount?: number }> }> = [];
  let siteTitle = "OMRGR";
  try {
    const [list, home] = await Promise.all([getSeriesList(), getHome()]);
    seriesList = list;
    siteTitle = home.siteTitle || "OMRGR";
  } catch {
    // no Sanity data yet
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header seriesList={seriesList} siteTitle={siteTitle} />
      <main className="min-h-0 flex-1 flex flex-col">{children}</main>
      <Footer seriesList={seriesList} />
    </div>
  );
}
