import { categories } from "@/lib/content";
import HomeGrid from "@/components/HomeGrid";

export default function HomePage() {
  return <HomeGrid categories={categories} />;
}
