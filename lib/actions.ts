import { connectDB, isMongoConnectionError } from './db';
import { Product } from './models/Product';

export async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: (p as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (p as { updatedAt?: Date }).updatedAt?.toISOString(),
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}

export async function getCategories() {
  try {
    await connectDB();
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return categories.map((c) => ({
      _id: c._id,
      name: c._id,
      slug: (c._id as string).toLowerCase().replace(/\s+/g, '-'),
      productCount: c.count,
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return {
      ...product,
      _id: product._id.toString(),
      createdAt: (product as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (product as { updatedAt?: Date }).updatedAt?.toISOString(),
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
}) {
  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (filters.category) filter.category = filters.category;
    if (filters.minPrice != null || filters.maxPrice != null) {
      filter.price = {};
      if (filters.minPrice != null) (filter.price as Record<string, number>).$gte = filters.minPrice;
      if (filters.maxPrice != null) (filter.price as Record<string, number>).$lte = filters.maxPrice;
    }
    const sort =
      filters.sort === 'price-asc'
        ? { price: 1 }
        : filters.sort === 'price-desc'
          ? { price: -1 }
          : filters.sort === 'name'
            ? { name: 1 }
            : { createdAt: -1 };
    const products = await Product.find(filter).sort(sort).lean();
    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: (p as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (p as { updatedAt?: Date }).updatedAt?.toISOString(),
    }));
  } catch (err) {
    if (isMongoConnectionError(err)) return [];
    throw err;
  }
}
