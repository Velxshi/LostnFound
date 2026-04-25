import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { timeAgo } from '@/lib/helper/time'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized) {
      return auth.response
    }

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page')) || 1
    const limit = 12
    const skip = (page - 1) * limit

    const sort = searchParams.get('sort') || 'terbaru'
    const statusId = searchParams.get('statusId')
    const categoryId = searchParams.get('categoryId')

    const where: any = {}

    if (statusId) {
      where.statusId = Number(statusId)
    }

    if (categoryId) {
      where.categoryId = Number(categoryId)
    }

    const orderBy =
      sort === 'terlama'
        ? { createdAt: 'asc' as const }
        : { createdAt: 'desc' as const }

    const totalItems = await prisma.item.count({ where })

    const items = await prisma.item.findMany({
      where,
      include: {
        status: true,
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    })

    const formatted = items.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.category.linkImage,
      status: {
        id: item.status.id,
        name: item.status.name,
      },
      time: timeAgo(item.createdAt),
    }))

    return successResponse(
      {
        data: formatted,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          perPage: limit,
        },
      },
      'Berhasil ambil data items',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil data items')
  }
}

export async function POST(req: Request) {
  try{
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
        return auth.response
    }

    const userId = auth.token.id
    const body = await req.json()

    const item = await prisma.item.create({
      data: {
        title: body.title,
        categoryId: body.categoryId,
        desc: body.desc,
        statusId: body.statusId,
        userId: Number(userId),
        createdAt: body.tanggal
          ? new Date(body.tanggal)
          : new Date(),
        note: body.note || null,
        locationDetail: body.locationDetail || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        itemDetails: body.itemDetails || null,
        characteristics: body.characteristics || null,
      },
    })

    return successResponse(
      { id: item.id },
      'Berhasil laporkan item'
    )

  } catch (error) {
    console.error(error)
    return errorResponse('Gagal laporkan item')
  }
}