import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1 });

export const Review = models.Review || model('Review', ReviewSchema);
