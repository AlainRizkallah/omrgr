import { getHome } from "@/lib/sanity/data";
import HomeHero from "@/components/HomeHero";

export const revalidate = 60;

export default async function HomePage() {
  const home = await getHome();
  return (
    <div className="flex min-h-full flex-1 flex-col w-full">
      <HomeHero
        heroImageUrl={home.heroImageUrl}
        heroImageMargin={home.heroImageMargin}
        intro={home.intro}
        siteTitle={home.siteTitle}
      />
    </div>
  );
}
