import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'
const nodemailer = require('nodemailer')

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req)
    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const { id } = await params
    const itemId = Number(id)
    const body = await req.json()
    const { locationDetail, dateFound, additionalNote } = body

    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        user: true,
      },
    })

    if (!item) {
      return errorResponse('Data barang tidak ditemukan', 404)
    }

    if (item.statusId !== 1) {
      return errorResponse('Barang ini sudah tidak dalam status hilang.', 400)
    }

    await prisma.item.update({
      where: { id: itemId },
      data: {
        locationDetail: locationDetail,
        note: additionalNote,
      },
    })

    await prisma.notification.create({
      data: {
        userId: item.userId,
        templateId: 1,
        itemId: itemId,
        message: `${auth.token.name} memberikan informasi untuk barang "${item.title}" Anda.`,
        isRead: false,
      },
    })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${auth.token.name} via LostnFound" <${process.env.EMAIL_USER}>`,
      to: item.user.email,
      replyTo: auth.token.email,
      subject: `Informasi Penemuan Barang: ${item.title}`,
      html: `
       <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Halo ${item.user.name},</h2>
          <p>Seseorang memberikan informasi lokasi baru untuk barang Anda yang hilang.</p>
          <ul>
            <li><b>Barang:</b> ${item.title}</li>
            <li><b>Lokasi:</b> ${locationDetail}</li>
            <li><b>Tanggal Ditemukan:</b> ${dateFound}</li>
            <li><b>Pesan Penemu:</b> ${additionalNote}</li>
          </ul>
          <p>Silakan segera hubungi penemu untuk proses koordinasi lebih lanjut.</p>
        </div>
      `,
    })

    return successResponse(null, 'Pesan berhasil diteruskan ke pemilik barang')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal memproses informasi')
  }
}
