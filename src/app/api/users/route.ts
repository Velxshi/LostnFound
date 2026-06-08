import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized) {
      return auth.response
    }

    const users = await prisma.user.findMany({
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
      orderBy: { id: 'asc' },
    })

    return successResponse(
      {
        data: users,
      },
      'Berhasil ambil data user',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil kategori')
  }
}

type Params = {
  id: number
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> | Params },
) {
  try {
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return auth.response
    }

    const resolvedParams = await params
    const userId = resolvedParams.id

    const body = await req.json()
    const { roleId } = body

    if (!roleId) {
      return errorResponse('ID Role harus dikirim di dalam body', 400)
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userExists) {
      return errorResponse('User tidak ditemukan', 404)
    }

    const roleExists = await prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!roleExists) {
      return errorResponse('Role tidak ditemukan di sistem', 404)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roleId: roleId,
      },
      select: {
        id: true,
        name: true,
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
    })
    return successResponse(
      {
        user: updatedUser,
      },
      `Berhasil mengubah role user menjadi ${roleExists.roleName}`,
    )
  } catch (error) {
    console.error('Error saat patch role:', error)
    return errorResponse('Gagal mengubah role user')
  }
}
