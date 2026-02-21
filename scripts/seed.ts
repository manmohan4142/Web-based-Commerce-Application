/**
 * Seed script: run with npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 * Or add "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/seed.ts" to package.json
 *
 * Requires MONGODB_URI and optionally an admin email. Creates sample products and an admin user.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    name: { type: String },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const sampleProducts = [
  {
    name: 'Neon Headphones',
    slug: 'neon-headphones',
    description: 'Wireless over-ear headphones with neon accents and 30h battery.',
    price: 19900,
    compareAtPrice: 24900,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    category: 'Electronics',
    inStock: true,
    featured: true,
  },
  {
    name: 'Quantum Keyboard',
    slug: 'quantum-keyboard',
    description: 'Mechanical keyboard with RGB lighting and hot-swappable switches.',
    price: 14900,
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800'],
    category: 'Electronics',
    inStock: true,
    featured: true,
  },
  {
    name: 'Cyber Watch',
    slug: 'cyber-watch',
    description: 'Smartwatch with health tracking and futuristic design.',
    price: 29900,
    compareAtPrice: 34900,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    category: 'Wearables',
    inStock: true,
    featured: true,
  },
  {
    name: 'Holographic Speaker',
    slug: 'holographic-speaker',
    description: 'Portable Bluetooth speaker with 360° sound and LED ring.',
    price: 12900,
    images: ['https://images.unsplash.com/photo-1545454670-2c83f2b7f4d8?w=800'],
    category: 'Electronics',
    inStock: true,
    featured: false,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log('Inserted', sampleProducts.length, 'products');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexus.demo';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        passwordHash,
        name: 'Admin',
        role: 'admin',
      },
    },
    { upsert: true }
  );
  console.log('Admin user:', adminEmail, '(password:', adminPassword, ')');

  await mongoose.disconnect();
  console.log('Seed done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
