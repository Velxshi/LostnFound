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

    const {
      warnaBarang,
      lokasiTerakhir,
      isiBarang,
      ciriKhusus,
      pesanTambahan,
    } = body

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { user: true },
    })

    if (!item) {
      return errorResponse('Data barang tidak ditemukan', 404)
    }

    if (item.statusId !== 2) {
      return errorResponse('Barang ini sudah tidak dalam status temuan.', 400)
    }

    await prisma.notification.create({
      data: {
        userId: item.userId,
        templateId: 2,
        itemId: itemId,
        message: `${auth.token.name} mengklaim bahwa "${item.title}" adalah miliknya.`,
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
      from: `"Klaim Kepemilikan - LostnFound" <${process.env.EMAIL_USER}>`,
      to: item.user.email, // Email si Penemu
      replyTo: auth.token.email, // Email si Pemilik (agar bisa dibalas langsung)
      subject: `Seseorang Mengklaim Barang yang Anda Temukan: ${item.title}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Halo ${item.user.name},</h2>
          <p>Seseorang bernama <b>${auth.token.name}</b> mengaku sebagai pemilik sah dari barang yang Anda temukan (<b>${item.title}</b>).</p>
          
          <p>Berikut adalah bukti-bukti yang dia berikan untuk memvalidasi kepemilikannya:</p>
          
          <table border="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <tr><td style="width: 150px;"><b>Warna Barang</b></td><td>: ${warnaBarang}</td></tr>
            <tr><td><b>Lokasi Terakhir Merasa Hilang</b></td><td>: ${lokasiTerakhir}</td></tr>
            <tr style="background: #fdf2f2;"><td><b>Isi di Dalam Barang</b></td><td>: ${isiBarang}</td></tr>
            <tr style="background: #fdf2f2;"><td><b>Ciri-Ciri Khusus</b></td><td>: ${ciriKhusus}</td></tr>
            <tr><td><b>Pesan Tambahan</b></td><td>: ${pesanTambahan || '-'}</td></tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #ef4444; background: #fff5f5;">
            <b>Tindakan Anda:</b><br/>
            Jika rincian di atas <b>COCOK</b> dengan barang yang Anda pegang, silakan balas email ini untuk membuat janji temu dengan si pemilik. 
            Jika <b>TIDAK COCOK</b>, Anda bisa mengabaikan klaim ini.
          </div>
        </div>
      `,
    })

    return successResponse(null, 'Form klaim berhasil dikirim ke email pemilik')
  } catch {
    return errorResponse('Gagal mengirim form klaim')
  }
}
