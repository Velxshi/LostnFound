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

        const where: any = {
            latitude: { not: null },
            longitude: { not: null },
            status: {
                name: { not: 'DONE' }
            },
        }

        if (filter === 'laporan-saya') {
            where.userId = userId
        } else if (filter === 'hilang') {
            where.status = { name: 'LOST' }
        } else if (filter === 'temuan') {
            where.status = { name: 'FOUND' }
        }

        const items = await prisma.item.findMany({
        select: {
            id: true,
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
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        status: {
            id: item.status.id,
            name: item.status.name,
        },
        }))

        return successResponse(
        { data: markers },
        'Berhasil ambil data map report'
        )
    } catch (error) {
        console.error(error)
        return errorResponse('Gagal ambil data map report')
    }
}