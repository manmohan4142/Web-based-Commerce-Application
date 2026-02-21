import { getFeaturedProducts, getCategories } from '@/lib/actions';
import { HomePageContent } from '@/components/home/HomePageContent';

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <HomePageContent
      featuredProducts={featuredProducts}
      categories={categories}
    />
  );
}
