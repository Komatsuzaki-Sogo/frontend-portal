import { HomeContent } from '@/components/pages/home/HomeContent';
import { getAllCategoriesWithCount } from '@/lib/mdLoader';

export default async function Home() {
  const categories = await getAllCategoriesWithCount();

  return <HomeContent categories={categories} />;
}
