import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: ShippingAddressSchema,
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', OrderSchema);
