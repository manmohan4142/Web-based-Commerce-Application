# NEXUS — Futuristic E-Commerce

A full-stack, production-ready e-commerce site with a dark cyberpunk/glassmorphism UI, built with Next.js 14, Tailwind, Framer Motion, MongoDB, Stripe, and NextAuth.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark theme, neon accents)
- **Framer Motion** (page transitions, micro-interactions)
- **MongoDB** + Mongoose
- **Stripe** (payments)
- **NextAuth** (credentials + Google)
- **Zustand** (cart state, persisted)

## Getting Started

### 1. Install dependencies

```bash
cd ecommerce-app
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — random string (e.g. `openssl rand -base64 32`)
- `NEXTAUTH_URL` — `http://localhost:3000` in dev
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe Dashboard
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` for Google sign-in
- Optional: `ADMIN_EMAIL`, `ADMIN_PASSWORD` for seed script

### 3. Seed database (optional)

```bash
# Set MONGODB_URI and optionally ADMIN_EMAIL, ADMIN_PASSWORD
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
```

This creates sample products and an admin user (default `admin@nexus.demo` / `admin123`). To make a user admin in an existing DB, set `role: 'admin'` on their user document.

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/          # Route handlers: auth, products, categories, checkout, orders, newsletter
  auth/          # Login, register
  admin/         # Dashboard, products CRUD, orders (admin only)
  shop/          # Shop grid, product detail
  cart/          # Cart page
  checkout/      # Stripe checkout + success
components/
  ui/            # Button, Card, Input, Spinner, Skeleton
  layout/        # Navbar, Footer, PageTransition
  cart/          # CartDrawer
  product/       # ProductCard
lib/
  actions.ts     # Server actions (get products, categories, product by slug)
  auth.ts        # NextAuth config
  db.ts          # MongoDB connection
  utils.ts       # cn, formatPrice, slugify
  models/        # Product, Order, User, Review
store/
  cartStore.ts   # Zustand cart (add, remove, persist)
types/
  index.ts       # Product, CartItem, Order, etc.
```

## Features

- **Landing**: Hero, featured products, categories grid, testimonials, newsletter
- **Shop**: Filters (category, price), sort, product grid with animations
- **Product detail**: Gallery, add to cart, related products
- **Cart**: Editable items, drawer + full cart page, remove animation
- **Checkout**: Stripe Payment Element, address form, order creation
- **Auth**: Login, register (credentials), Google OAuth
- **Admin**: Add/edit/delete products, view orders (role `admin` required)

## Design

- Dark mode by default, neon green/blue/pink accents
- Glassmorphism cards, gradient borders, soft glow
- Framer Motion: page transitions, staggered grids, hover states, cart drawer
- Mobile-first, responsive layout

## Stripe

Use test keys and [test cards](https://stripe.com/docs/testing). Price is stored in cents in the DB and sent to Stripe as-is.

## Admin access

Only users with `role: 'admin'` can access `/admin/*`. After seeding, sign in with the admin email/password. To promote an existing user, set their `role` to `admin` in the `users` collection.

## License

MIT
