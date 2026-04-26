import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    ) {
    try {
        const auth = await requireAuth(req)

        if (!auth.authorized || !auth.token) {
        return auth.response
        }

        const userId = Number(auth.token.id)

        const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: true,
        },
        })

        if (!user || user.role.roleName !== 'ADMIN') {
        return errorResponse('Hanya admin yang boleh mengubah kategori', 403)
        }

        const { id } = await params
        const categoryId = Number(id)

        if (isNaN(categoryId)) {
        return errorResponse('ID kategori tidak valid', 400)
        }

        const body = await req.json()

        const name = body.name?.trim()
        const linkImage = body.linkImage?.trim()

        if (!name || !linkImage) {
        return errorResponse('Nama kategori dan link image wajib diisi', 400)
        }

        const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        })

        if (!existingCategory) {
        return errorResponse('Kategori tidak ditemukan', 404)
        }

        const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
            name,
            linkImage,
        },
        select: {
            id: true,
            name: true,
            linkImage: true,
            updatedAt: true,
        },
        })

        return successResponse(
        {data: updatedCategory},
        'Berhasil update kategori',
        )
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

        return errorResponse('Gagal update kategori')
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    ) {
    try {
        const auth = await requireAuth(req)

        if (!auth.authorized || !auth.token) {
            return auth.response
        }

        const userId = Number(auth.token.id)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
            },
        })

        if (!user || user.role.roleName !== 'ADMIN') {
            return errorResponse('Hanya admin yang boleh menghapus kategori', 403)
        }

        const { id } = await params
        const categoryId = Number(id)

        if (isNaN(categoryId)) {
            return errorResponse('ID kategori tidak valid', 400)
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: {
                        items: true,
                    },
                },
            },
        })

        if (!existingCategory) {
            return errorResponse('Kategori tidak ditemukan', 404)
        }

        if (existingCategory._count.items > 0) {
            return errorResponse(
                'Kategori tidak dapat dihapus karena masih digunakan oleh item',
                400,
            )
        }

        await prisma.category.delete({
            where: { 
                id: categoryId 
            },
        })

        return successResponse(
            {data:{
                id: existingCategory.id,
                name: existingCategory.name,
            }},
            'Berhasil hapus kategori',
        )
    } catch (error) {
        console.error(error)
        return errorResponse('Gagal hapus kategori')
    }
}