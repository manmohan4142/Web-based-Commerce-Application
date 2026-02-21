import Link from 'next/link';
import { getProducts } from '@/lib/actions';
import { ProductCard } from '@/components/product/ProductCard';

export async function RelatedProducts({
  category,
  excludeId,
}: {
  category: string;
  excludeId: string;
}) {
  const products = await getProducts({ category });
  const related = products.filter((p) => p._id !== excludeId).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-cyber-border pt-16">
      <h2 className="mb-8 text-2xl font-bold text-white">Related products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
