import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

type Params = {
  id: string
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> | Params },
) {
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
        'Hanya superadmin yang boleh mengubah hak akses',
        403,
      )
    }

    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id, 10)
    if (isNaN(userId)) {
      return errorResponse('ID user di URL harus berupa angka', 400)
    }

    const body = await req.json()
    const { permissionIds } = body

    if (!Array.isArray(permissionIds)) {
      return errorResponse('permissionIds harus berupa array', 400)
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    })

    if (!userExists) {
      return errorResponse('User tidak ditemukan', 404)
    }

    if (userExists.role.roleName !== 'ADMIN') {
      return errorResponse(
        'Hak akses hanya bisa diubah untuk user dengan role ADMIN',
        403,
      )
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.userPermission.deleteMany({
        where: { userId },
      })

      if (permissionIds.length > 0) {
        const validPermissions = await tx.permission.findMany({
          where: { id: { in: permissionIds } },
          select: { id: true },
        })

        if (validPermissions.length > 0) {
          await tx.userPermission.createMany({
            data: validPermissions.map((perm) => ({
              userId,
              permissionId: perm.id,
            })),
          })
        }
      }

      // 3. Return data terbaru
      return await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: { id: true, roleName: true },
          },
          userPermissions: {
            select: {
              permission: {
                select: { id: true, name: true },
              },
            },
          },
        },
      })
    })

    const result = {
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      role: updatedUser!.role,
      permissions: updatedUser!.userPermissions.map((up) => up.permission),
    }

    return successResponse({ user: result }, 'Berhasil mengubah hak akses user')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal mengubah hak akses user')
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> | Params },
) {
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

    const resolvedParams = await params
    const adminId = parseInt(resolvedParams.id, 10)
    if (isNaN(adminId)) {
      return errorResponse('ID tidak valid atau salah format.', 400)
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
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
    })

    if (!admin || admin.role.roleName !== 'ADMIN') {
      return errorResponse('Data hak akses admin tidak ditemukan.', 404)
    }

    const formattedData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.userPermissions.map((up) => up.permission),
    }

    return successResponse(formattedData, 'Berhasil ambil detail hak akses')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil detail hak akses')
  }
}
