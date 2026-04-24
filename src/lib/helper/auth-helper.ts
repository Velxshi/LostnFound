import { getToken } from 'next-auth/jwt'
import { errorResponse } from '@/lib/response'

export async function requireAuth(req: Request) {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return {
      authorized: false,
      response: errorResponse('Harus login dulu!', 401),
    }
  }

  return {
    authorized: true,
    token,
  }
}
