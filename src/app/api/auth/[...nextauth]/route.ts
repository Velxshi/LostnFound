// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Ubah ke JWT
    maxAge: 60 * 60,
    updateAge: 30 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama kali, user akan berisi data dari DB
      if (user) {
        token.id = Number(user.id)
        token.roleId = (user as any).roleId
      }
      return token
    },
    async session({ session, token }) {
      // Pindahkan data dari token ke session agar bisa dibaca di frontend
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).roleId = token.roleId
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
