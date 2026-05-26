import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAuth(req)

        if (!auth.authorized || !auth.token) {
        return auth.response
        }

        const userId = Number(auth.token.id)

        const { id } = await params
        const itemId = Number(id)

        const item = await prisma.item.findUnique({
        where: { id: itemId },
        })

        if (!item) {
        return errorResponse('Item tidak ditemukan', 404)
        }

        if (item.userId !== userId) {
        return errorResponse(
            'Kamu tidak punya akses untuk item ini',
            403
        )
        }

        const doneStatus = await prisma.status.findUnique({
        where: {
            name: 'SELESAI',
        },
        })

        if (!doneStatus) {
        return errorResponse('Status SELESAI tidak ditemukan', 404)
        }

        await prisma.item.update({
        where: { id: itemId },
        data: {
            statusId: doneStatus.id,
        },
        })

        return successResponse(
        null,
        'Item berhasil ditandai selesai'
        )
    } catch (error) {
        console.error(error)
        return errorResponse('Gagal tandai item')
    }
}