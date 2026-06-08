import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized) {
      return auth.response
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              roleName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereCondition }),
    ])

    const totalPages = Math.ceil(totalUsers / limit)

    return successResponse(
      {
        data: users,
        meta: {
          currentPage: page,
          limit,
          totalItems: totalUsers,
          totalPages,
        },
      },
      'Berhasil ambil data user',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil data users')
  }
}
