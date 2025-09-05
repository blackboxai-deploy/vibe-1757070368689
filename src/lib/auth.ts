import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import dbConnect from '@/lib/database';
import User from '@/lib/models/User';
import { UserRole } from '@/types';

const client = new MongoClient(process.env.MONGODB_URI!);

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase(),
            isActive: true 
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            profile: user.profile
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.profile = user.profile;
        
        // For OAuth providers, create user in database if not exists
        if (account.provider !== 'credentials') {
          await dbConnect();
          
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            // Create new user for OAuth
            dbUser = new User({
              email: user.email,
              name: user.name || 'New User',
              password: 'oauth_user', // Placeholder for OAuth users
              role: UserRole.ALUMNI, // Default role
              profile: {
                firstName: user.name?.split(' ')[0] || 'New',
                lastName: user.name?.split(' ')[1] || 'User',
                avatar: user.image,
                isPublic: true
              }
            });
            await dbUser.save();
          }
          
          token.role = dbUser.role;
          token.profile = dbUser.profile;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.profile = token.profile;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  events: {
    async signIn({ user }) {
      // Update last active timestamp
      if (user?.email) {
        await dbConnect();
        await User.findOneAndUpdate(
          { email: user.email },
          { 'profile.lastActive': new Date() }
        );
      }
    },
  },
};

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      profile: any;
    };
  }

  interface User {
    role: UserRole;
    profile: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    profile: any;
  }
}