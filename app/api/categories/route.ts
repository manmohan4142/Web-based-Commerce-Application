import { NextResponse } from 'next/server';
import { connectDB, isMongoConnectionError } from '@/lib/db';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const result = categories.map((c) => ({
      _id: c._id,
      name: c._id,
      slug: c._id.toLowerCase().replace(/\s+/g, '-'),
      productCount: c.count,
    }));
    return NextResponse.json(result);
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json([]);
    }
    console.error('Categories API error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
