import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search')?.trim()

    const where: any = {}

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        linkImage: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { id: 'asc' },
    })

    const totalItems = await prisma.item.count()

    const totalCategories = await prisma.category.count()

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      linkImage: cat.linkImage,
      totalItems: cat._count.items,
    }))

    return successResponse(
      {
        totalItems,
        totalCategories,
        categories: formattedCategories,
      },
      'Berhasil ambil kategori',
    )
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal ambil kategori')
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const userId = Number(auth.token.id)

    const hasPermission = await prisma.userPermission.findFirst({
      where: {
        userId,
        permission: {
          name: 'action:create_category',
        },
      },
    })

    if (!hasPermission) {
      return errorResponse(
        'Akses ditolak. Anda tidak memiliki izin untuk menambahkan kategori.',
        403,
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    })

    if (!user || user.role.roleName !== 'ADMIN') {
      return errorResponse('Hanya admin yang boleh menambahkan kategori', 403)
    }

    const body = await req.json()

    const name = body.name?.trim()
    const linkImage = body.linkImage?.trim()

    if (!name) {
      return errorResponse('Nama kategori wajib diisi', 400)
    }

    if (name.length < 2) {
      return errorResponse('Nama kategori minimal 2 karakter', 400)
    }

    if (name.length > 50) {
      return errorResponse('Nama kategori maksimal 50 karakter', 400)
    }

    if (!linkImage) {
      return errorResponse('Link gambar wajib diisi', 400)
    }

    try {
      new URL(linkImage)
    } catch {
      return errorResponse('Format link gambar tidak valid', 400)
    }

    const category = await prisma.category.create({
      data: {
        name,
        linkImage,
      },
      select: {
        id: true,
        name: true,
        linkImage: true,
      },
    })

    return successResponse({ data: category }, 'Berhasil tambah kategori')
  } catch (error) {
    console.error(error)

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2002'
    ) {
      return errorResponse('Nama kategori sudah digunakan', 409)
    }

    return errorResponse('Gagal tambah kategori')
  }
}
