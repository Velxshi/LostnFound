import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const userId = Number(auth.token.id)

    const notif = await prisma.notification.findMany({
      where: { userId: userId },
      select: {
        id: true,
        isRead: true,
        template: {
          select: {
            content: true,
            name: true,
          },
        },
        createdAt: true,
      },
    })

    if (!notif) {
      return errorResponse('Notifikasi tidak ditemukan', 404)
    }

    return successResponse({ data: notif }, 'Data notifikasi berhasil diambil')
  } catch {
    return errorResponse('Gagal ambil data notifikasi')
  }
}
