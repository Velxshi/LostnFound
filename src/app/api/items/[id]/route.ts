import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { timeAgo } from '@/lib/helper/time'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req)
    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const { id } = await params
    const itemId = Number(id)

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        status: true,
        category: true,
      },
    })

    if (!item) {
      return errorResponse('Item tidak ditemukan', 404)
    }

    const formatted = {
      id: item.id,
      image: item.category.linkImage,
      title: item.title,
      status: {
        id: item.status.id,
        name: item.status.name,
      },
      category: {
        id: item.category.id,
        name: item.category.name,
      },
      desc: item.desc,
      ditemukanPada: item.createdAt.toISOString().split('T')[0],
      diunggah: timeAgo(item.createdAt),
    }

    return successResponse({ data: formatted }, 'Berhasil ambil detail item')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil detail item')
  }
}
