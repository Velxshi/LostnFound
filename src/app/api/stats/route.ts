import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'
import {
  eachDayOfInterval,
  format,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns'

export async function GET(req: Request) {
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
      return errorResponse('Hanya admin yang boleh menambahkan kategori', 403)
    }

    const { searchParams } = new URL(req.url)
    const days = searchParams.get('period') === '30' ? 30 : 7
    const startDate = startOfDay(subDays(new Date(), days - 1))

    const today = new Date()

    const [totalReports, activeLost, activeFound, returned] = await Promise.all(
      [
        prisma.item.count(),
        prisma.item.count({ where: { statusId: 1 } }),
        prisma.item.count({ where: { statusId: 2 } }),
        prisma.item.count({ where: { statusId: 3 } }),
      ],
    )

    const items = await prisma.item.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        statusId: true,
      },
    })

    const allDays = eachDayOfInterval({
      start: startDate,
      end: today,
    })

    const chartData = allDays.map((date) => {
      const itemsToday = items.filter((item) => isSameDay(item.createdAt, date))

      return {
        date: format(date, 'yyyy-MM-dd'),
        label: isSameDay(date, today) ? 'Today' : format(date, 'd MMM'),
        lost: itemsToday.filter((i) => i.statusId === 1).length,
        found: itemsToday.filter((i) => i.statusId === 2).length,
        done: itemsToday.filter((i) => i.statusId === 3).length,
      }
    })

    return successResponse(
      {
        summary: {
          total_reports: totalReports,
          active_lost_items: activeLost,
          active_found_items: activeFound,
          returned_items: returned,
        },
        chart_data: chartData,
      },
      'Berhasil mengambil statistik admin',
    )
  } catch {
    return errorResponse('Gagal mengambil statistik')
  }
}
