import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // in cents for Stripe
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, price: 1 });
// slug already has unique: true which creates an index; no need for duplicate index

export const Product = models.Product || model('Product', ProductSchema);
