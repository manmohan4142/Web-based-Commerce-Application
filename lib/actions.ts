import { connectDB, isMongoConnectionError } from './db';
import { Product } from './models/Product';
import type { Product as ProductType, Category as CategoryType } from '@/types';

export async function getFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean<ProductType[]>();

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toString(),
      updatedAt: p.updatedAt?.toString(),
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  try {
    await connectDB();

    const categories = await Product.aggregate<{
      _id: string;
      count: number;
    }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return categories.map((c) => ({
      _id: c._id,
      name: c._id,
      slug: c._id.toLowerCase().replace(/\s+/g, '-'),
      productCount: c.count,
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductType | null> {
  try {
    await connectDB();

    const product = await Product.findOne({ slug })
      .lean<ProductType | null>();

    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
    };
  } catch (err) {
    if (isMongoConnectionError(err)) return null;
    throw err;
  }
}

export async function getProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<ProductType[]> {
  try {
    await connectDB();

    const filter: Record<string, unknown> = {};

    if (filters.category) filter.category = filters.category;

    if (filters.minPrice != null || filters.maxPrice != null) {
      filter.price = {};
      if (filters.minPrice != null)
        (filter.price as Record<string, number>).$gte = filters.minPrice;
      if (filters.maxPrice != null)
        (filter.price as Record<string, number>).$lte = filters.maxPrice;
    }

    const sort: Record<string, 1 | -1> =
      filters.sort === 'price-asc'
        ? { price: 1 }
        : filters.sort === 'price-desc'
        ? { price: -1 }
        : filters.sort === 'name'
        ? { name: 1 }
        : { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sort)
      .lean<ProductType[]>(); // ✅ FIXED HERE

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toString(),
      updatedAt: p.updatedAt?.toString(),
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}