import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { User } from './models/User';

// Ensure NEXTAUTH_URL is set for Vercel (required for auth redirects/callbacks)
if (process.env.VERCEL && !process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user?.passwordHash) return null;
        const match = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!match) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        await connectDB();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              email: user.email,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
            },
          },
          { upsert: true }
        );
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? undefined;
        (session.user as { role?: string }).role = (token.role as string) ?? undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      if (token.sub && !token.role) {
        await connectDB();
        const dbUser = await User.findById(token.sub);
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
