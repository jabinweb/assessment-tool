import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Call API route to verify credentials
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const response = await fetch(`${baseUrl}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (response.ok) {
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const user = await response.json()
              return {
                id: user.id,
                email: user.email,
                name: user.name || user.email,
                image: user.image,
                role: user.role || 'user'
              }
            }
          }
        } catch (error) {
          console.error('Auth verification error:', error)
        }

        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // Try to get user data from database, but don't fail if DB is down
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email! }
          });
          
          if (dbUser) {
            session.user.role = dbUser.role;
            session.user.name = dbUser.name || session.user.name;
          } else {
            // Set default role if user not found
            session.user.role = 'user';
          }
        } catch (error) {
          console.error('Database connection error in session callback:', error);
          // Set default values when database is unavailable
          session.user.role = 'user';
        }
      }
      return session;
    },
    
    async jwt({ token, user, account }) {
      if (user && account) {
        token.sub = user.id;
      }
      return token;
    },
    
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful login
      if (url.startsWith('/')) {
        return url === '/auth/login' ? '/dashboard' : url;
      }
      return baseUrl + '/dashboard';
    }
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: process.env.NODE_ENV === 'development',
})
