import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
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
        'Berhasil ambil kategori'
        )
    } catch (error) {
        console.error(error)
        return errorResponse('Gagal ambil kategori')
    }
}