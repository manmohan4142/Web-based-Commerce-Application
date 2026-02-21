import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isMongoConnectionError } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import type { SortOption } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = (searchParams.get('sort') as SortOption) || 'newest';
    const featured = searchParams.get('featured') === 'true';

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (minPrice != null && minPrice !== '') {
      filter.price = { ...(filter.price as object), $gte: Number(minPrice) };
    }
    if (maxPrice != null && maxPrice !== '') {
      filter.price = { ...(filter.price as object), $lte: Number(maxPrice) };
    }
    if (minPrice != null && maxPrice != null && minPrice !== '' && maxPrice !== '') {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    const sortOption: Record<string, 1 | -1> =
      sort === 'price-asc'
        ? { price: 1 }
        : sort === 'price-desc'
          ? { price: -1 }
          : sort === 'name'
            ? { name: 1 }
            : { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .lean();

    const serialized = products.map((p) => ({
      ...p,
      _id: (p._id as { toString(): string }).toString(),
      createdAt: (p as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (p as { updatedAt?: Date }).updatedAt?.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json([]);
    }
    console.error('Products API error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, images, inStock, featured } = body;
    if (!name || description == null || price == null || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category' },
        { status: 400 }
      );
    }
    await connectDB();
    const slug =
      body.slug ||
      `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const product = await Product.create({
      name,
      slug,
      description,
      price: Math.round(Number(price) * 100),
      compareAtPrice: body.compareAtPrice ? Math.round(Number(body.compareAtPrice) * 100) : undefined,
      images: Array.isArray(images) ? images : [],
      category,
      inStock: inStock !== false,
      featured: Boolean(featured),
    });
    return NextResponse.json({
      ...product.toObject(),
      _id: (product._id as { toString(): string }).toString(),
    });
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json(
        { error: 'Database unavailable. Start MongoDB or set MONGODB_URI.' },
        { status: 503 }
      );
    }
    console.error('Create product error:', e);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
