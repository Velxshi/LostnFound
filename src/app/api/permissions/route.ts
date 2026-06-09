import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)
    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const actorId = Number(auth.token.id)

    const actor = await prisma.user.findUnique({
      where: { id: actorId },
      include: { role: true },
    })

    if (!actor || actor.role.roleName !== 'SUPERADMIN') {
      return errorResponse(
        'Akses ditolak. Hanya Superadmin yang diizinkan.',
        403,
      )
    }

    const permissions = await prisma.permission.findMany({
      where: {
        id: { notIn: [3, 4] },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { id: 'asc' },
    })

    return successResponse(
      { data: permissions },
      'Berhasil ambil daftar hak akses',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil daftar hak akses')
  }
}
