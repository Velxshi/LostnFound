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
        'Hanya superadmin yang boleh mengubah role user',
        403,
      )
    }

    const resolvedParams = await params

    const userId = parseInt(resolvedParams.id, 10)
    if (isNaN(userId)) {
      return errorResponse('ID User di URL harus berupa angka', 400)
    }

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

    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Hapus permission lama jika ada
      await tx.userPermission.deleteMany({
        where: { userId },
      })

      // 2. Tentukan target permission baru berdasarkan role tujuan
      let targetPermissionNames: string[] = []

      if (roleExists.roleName === 'ADMIN') {
        targetPermissionNames = ['menu:dashboard']
      } else if (roleExists.roleName === 'SUPERADMIN') {
        targetPermissionNames = ['menu:users', 'menu:hak-akses']
      }
      // USER: targetPermissionNames tetap kosong []

      // 3. Tambahkan permission baru jika ada
      if (targetPermissionNames.length > 0) {
        const matchedPermissions = await tx.permission.findMany({
          where: {
            name: { in: targetPermissionNames },
          },
          select: { id: true },
        })

        if (matchedPermissions.length > 0) {
          await tx.userPermission.createMany({
            data: matchedPermissions.map((perm) => ({
              userId,
              permissionId: perm.id,
            })),
          })
        }
      }

      // 4. Update roleId user
      return await tx.user.update({
        where: { id: userId },
        data: { roleId },
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
    })

    return successResponse(
      { user: updatedUser },
      `Berhasil mengubah role user menjadi ${roleExists.roleName} beserta penyesuaian hak akses.`,
    )
  } catch (error) {
    console.error('Error saat patch role:', error)
    return errorResponse('Gagal mengubah role user')
  }
}
