// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      roleId: number | null
      roleName: string | null
      permissions: string[]
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    roleId: number | null
    roleName: string | null
    permissions: string[]
  }
}

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
      if (user) {
        token.id = Number(user.id)
      }

      if (token.id) {
        const userWithRole = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          include: {
            role: true,
            userPermissions: {
              include: {
                permission: true,
              },
            },
          },
        })

        token.roleId = userWithRole?.roleId ?? null
        token.roleName = userWithRole?.role?.roleName ?? null
        token.permissions =
          userWithRole?.userPermissions.map((up) => up.permission.name) ?? []
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.roleId = token.roleId
      session.user.roleName = token.roleName
      session.user.permissions = token.permissions
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
