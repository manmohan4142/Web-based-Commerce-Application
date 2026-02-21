import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isMongoConnectionError } from '@/lib/db';
import { Product } from '@/lib/models/Product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const doc = product as { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date };
    return NextResponse.json({
      ...product,
      _id: doc._id.toString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    });
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    console.error('Product by slug error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    await connectDB();
    const product = await Product.findOneAndUpdate(
      { slug },
      {
        ...(body.name && { name: body.name }),
        ...(body.description != null && { description: body.description }),
        ...(body.price != null && { price: Math.round(Number(body.price) * 100) }),
        ...(body.compareAtPrice != null && {
          compareAtPrice: Math.round(Number(body.compareAtPrice) * 100),
        }),
        ...(body.images && { images: body.images }),
        ...(body.category && { category: body.category }),
        ...(typeof body.inStock === 'boolean' && { inStock: body.inStock }),
        ...(typeof body.featured === 'boolean' && { featured: body.featured }),
      },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...product.toObject(),
      _id: (product._id as { toString(): string }).toString(),
    });
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    console.error('Update product error:', e);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOneAndDelete({ slug });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    if (isMongoConnectionError(e)) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    console.error('Delete product error:', e);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
