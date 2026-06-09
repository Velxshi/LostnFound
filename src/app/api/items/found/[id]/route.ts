import { requireAuth } from '@/lib/helper/auth-helper'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'
import { Resend } from 'resend'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req)
    if (!auth.authorized || !auth.token) {
      return auth.response
    }
    const userId = Number(auth.token.id)

    const { id } = await params
    const itemId = Number(id)
    const body = await req.json()
    const { locationDetail, dateFound, additionalNote } = body

    if (!locationDetail?.trim()) {
      return errorResponse(
        'Lokasi ditemukan wajib diisi',
        400,
      )
    }

    if (locationDetail.trim().length < 5) {
      return errorResponse(
        'Lokasi ditemukan terlalu pendek',
        400,
      )
    }

    if (!dateFound) {
      return errorResponse(
        'Tanggal ditemukan wajib diisi',
        400,
      )
    }

    const foundDate = new Date(dateFound)

    if (isNaN(foundDate.getTime())) {
      return errorResponse(
        'Format tanggal ditemukan tidak valid',
        400,
      )
    }

    if (foundDate > new Date()) {
      return errorResponse(
        'Tanggal ditemukan tidak boleh melebihi hari ini',
        400,
      )
    }

    if (
      additionalNote &&
      additionalNote.trim().length > 500
    ) {
      return errorResponse(
        'Pesan penemu maksimal 500 karakter',
        400,
      )
    }

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

    if (item.userId === Number(userId)) {
      return errorResponse(
        'Anda tidak dapat mengirim informasi pada laporan milik sendiri',
        400,
      )
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

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'LostnFound Temuan <temuan@lostnfound-s4tgas.my.id>',
      to: item.user.email,
      replyTo: auth.token.email ?? undefined,
      subject: `[Info Penemuan] ${item.title}`,
      text: `Halo ${item.user.name},\n\n${auth.token.name} memberikan informasi untuk barang Anda yang hilang ("${item.title}").\n\nDetail:\n- Lokasi ditemukan: ${locationDetail}\n- Tanggal ditemukan: ${dateFound}\n- Pesan penemu: ${additionalNote}\n\nHubungi penemu di: ${auth.token.email}\n\n— LostnFound`,
      html: `
       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">

                <tr>
                  <td style="background:#16a34a;padding:28px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:11px;letter-spacing:1.5px;color:#86efac;text-transform:uppercase;">LostnFound</p>
                          <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Ada informasi baru<br>untuk barang Anda yang hilang</h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:28px 32px;">
                    <p style="margin:0 0 6px;font-size:15px;color:#111827;">Halo <strong>${item.user.name}</strong>,</p>
                    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                      Seseorang bernama <strong style="color:#111827;">${auth.token.name}</strong> memberikan informasi baru mengenai barang Anda yang hilang.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px 16px;">
                          <p style="margin:0;font-size:11px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">Barang dilaporkan</p>
                          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#16a34a;">${item.title}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">Detail informasi penemuan</p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr style="background:#f9fafb;">
                        <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;width:160px;font-size:13px;color:#6b7280;">Lokasi ditemukan</td>
                        <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${locationDetail}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">Tanggal ditemukan</td>
                        <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${dateFound}</td>
                      </tr>
                      <tr style="background:#f9fafb;">
                        <td style="padding:12px 14px;font-size:13px;color:#6b7280;">Pesan dari penemu</td>
                        <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:500;">${additionalNote}</td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:4px;padding:16px;">
                          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#14532d;">Tindak lanjut segera</p>
                          <p style="margin:0 0 14px;font-size:13px;color:#166534;line-height:1.6;">
                            Hubungi penemu langsung melalui tombol di bawah atau balas email ini untuk mengatur koordinasi pengambilan barang Anda.
                          </p>
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#16a34a;border-radius:4px;">
                                <a href="mailto:${auth.token.email}?subject=Re: Info Penemuan - ${item.title}"
                                  style="font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;display:inline-block;padding:10px 20px;">
                                  Hubungi ${auth.token.name}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <tr>
                  <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #f3f4f6;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.5;">
                      Email ini dikirim otomatis oleh sistem <strong>LostnFound</strong>.<br>Anda bisa membalas email ini untuk langsung terhubung dengan penemu.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      `,
    })

    return successResponse(null, 'Pesan berhasil diteruskan ke pemilik barang')
  } catch (error) {
    console.error(error)
    return errorResponse('Gagal memproses informasi')
  }
}
