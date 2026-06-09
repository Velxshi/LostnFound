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

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const whereCondition = {
      role: {
        roleName: 'ADMIN',
      },
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [admins, totalAdmins] = await prisma.$transaction([
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
          userPermissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereCondition }),
    ])

    const formattedData = admins.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.userPermissions.map((up) => up.permission),
    }))

    const totalPages = Math.ceil(totalAdmins / limit)

    return successResponse(
      {
        data: formattedData,
        meta: {
          currentPage: page,
          limit,
          totalItems: totalAdmins,
          totalPages,
        },
      },
      'Berhasil ambil data hak akses',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil data hak akses')
  }
}
