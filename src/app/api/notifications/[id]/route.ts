import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const param = await params
    const userId = Number(auth.token.id)
    const notifId = Number(param.id)

    if (isNaN(notifId)) {
      return errorResponse('ID Notifikasi tidak valid', 400)
    }

    const updatedNotif = await prisma.notification.updateMany({
      where: {
        id: notifId,
        userId: userId,
      },
      data: {
        isRead: true,
      },
    })

    if (updatedNotif.count === 0) {
      return errorResponse(
        'Notifikasi tidak ditemukan atau bukan milik Anda',
        404,
      )
    }

    return successResponse(null, 'Notifikasi berhasil ditandai sebagai dibaca')
  } catch {
    return errorResponse('Gagal memperbarui status notifikasi')
  }
}
