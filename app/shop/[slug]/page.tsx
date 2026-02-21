import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';
import { RelatedProducts } from './RelatedProducts';
import { PageTransition } from '@/components/layout/PageTransition';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/shop" className="hover:text-cyber-neon">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-cyber-border bg-cyber-darker">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-cyber-muted">
                  No image
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-cyber-border"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-cyber-neon">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice != null &&
                product.compareAtPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
            </div>
            <p className="mt-6 text-gray-300">{product.description}</p>
            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
            {!product.inStock && (
              <p className="mt-4 text-cyber-neon-pink">Out of stock</p>
            )}
          </div>
        </div>

        <RelatedProducts category={product.category} excludeId={product._id} />
      </div>
    </PageTransition>
  );
}
