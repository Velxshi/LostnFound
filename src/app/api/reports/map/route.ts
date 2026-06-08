import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const userId = auth.token.id

    const { searchParams } = new URL(req.url)

    const filter = searchParams.get('filter') || 'all'

    const search = searchParams.get('search')

    const where: any = {
      latitude: { not: null },
      longitude: { not: null },
      status: {
        name: { not: 'SELESAI' },
      },
    }

    if (filter === 'laporan-saya') {
      where.userId = userId
    } else if (filter === 'hilang') {
      where.status = { name: 'HILANG' }
    } else if (filter === 'temuan') {
      where.status = { name: 'TEMUAN' }
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const items = await prisma.item.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        latitude: true,
        longitude: true,
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where,
    })

    const markers = items.map((item) => ({
      id: item.id,
      title: item.title,
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      status: {
        id: item.status.id,
        name: item.status.name,
      },
      isMe: item.userId === Number(userId),
    }))

    return successResponse({ data: markers }, 'Berhasil ambil data map report')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil data map report')
  }
}
