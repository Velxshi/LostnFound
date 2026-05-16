import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireAuth } from '@/lib/helper/auth-helper'

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req)

        if (!auth.authorized || !auth.token) {
            return auth.response
        }

        const userId = Number(auth.token.id)
        const itemId = Number(params.id)

        // Cari item
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            include: {
                status: true,
            },
        })

        if (!item) {
            return errorResponse('Item tidak ditemukan', 404)
        }

        // Cek ownership
        if (item.userId !== userId) {
            return errorResponse(
                'Kamu tidak punya akses untuk item ini',
                403
            )
        }

        // Cari status DONE
        const doneStatus = await prisma.status.findUnique({
            where: {
                name: 'DONE',
            },
        })

        if (!doneStatus) {
            return errorResponse('Status DONE tidak ditemukan', 404)
        }

        // Update status item
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
        return errorResponse('Gagal tandai item selesai')
    }
}