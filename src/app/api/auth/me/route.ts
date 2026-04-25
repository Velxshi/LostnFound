import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const token = auth.token

    const user = await prisma.user.findUnique({
      where: { id: Number(token.id) },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
    })

    if (!user) {
      return errorResponse('User tidak ditemukan', 404)
    }

    return successResponse(user, 'Data user berhasil diambil')
  } catch {
    return errorResponse('Gagal ambil data profile')
  }
}
