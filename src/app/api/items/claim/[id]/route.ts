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

    if (!warnaBarang?.trim()) {
      return errorResponse('Warna barang wajib diisi', 400)
    }

    if (warnaBarang.trim().length < 3) {
      return errorResponse(
        'Warna barang minimal 3 karakter',
        400,
      )
    }

    if (!lokasiTerakhir?.trim()) {
      return errorResponse(
        'Lokasi terakhir hilang wajib diisi',
        400,
      )
    }

    if (lokasiTerakhir.trim().length < 5) {
      return errorResponse(
        'Lokasi terakhir hilang terlalu pendek',
        400,
      )
    }

    if (!isiBarang?.trim()) {
      return errorResponse(
        'Isi barang wajib diisi',
        400,
      )
    }

    if (isiBarang.trim().length < 3) {
      return errorResponse(
        'Isi barang minimal 3 karakter',
        400,
      )
    }

    if (!ciriKhusus?.trim()) {
      return errorResponse(
        'Ciri khusus wajib diisi',
        400,
      )
    }

    if (ciriKhusus.trim().length < 5) {
      return errorResponse(
        'Ciri khusus minimal 5 karakter',
        400,
      )
    }

    if (
      pesanTambahan &&
      pesanTambahan.trim().length > 500
    ) {
      return errorResponse(
        'Pesan tambahan maksimal 500 karakter',
        400,
      )
    }

    if (!item) {
      return errorResponse('Data barang tidak ditemukan', 404)
    }

    if (item.userId === Number(userId)) {
      return errorResponse(
        'Anda tidak dapat mengklaim barang milik sendiri',
        400,
      )
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

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'LostnFound Klaim <klaim@lostnfound-s4tgas.my.id>',
      to: item.user.email,
      replyTo: auth.token.email ?? undefined,
      subject: `[Klaim Barang] ${item.title}`,
      text: `Halo ${item.user.name},\n\n${auth.token.name} mengklaim bahwa "${item.title}" adalah miliknya.\n\nBukti yang diberikan:\n- Warna barang: ${warnaBarang}\n- Lokasi terakhir hilang: ${lokasiTerakhir}\n- Isi barang: ${isiBarang}\n- Ciri khusus: ${ciriKhusus}\n- Pesan tambahan: ${pesanTambahan || '-'}\n\nJika cocok, hubungi: ${auth.token.email}\n\n— LostnFound`,
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;">
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">

                  <tr>
                    <td style="background:#dc2626;padding:28px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <p style="margin:0;font-size:11px;letter-spacing:1.5px;color:#fca5a5;text-transform:uppercase;">LostnFound</p>
                            <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Ada klaim kepemilikan<br>untuk barang temuan Anda</h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:28px 32px;">
                      <p style="margin:0 0 6px;font-size:15px;color:#111827;">Halo <strong>${item.user.name}</strong>,</p>
                      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                        Seseorang bernama <strong style="color:#111827;">${auth.token.name}</strong> mengaku sebagai pemilik sah dari barang yang Anda temukan.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                        <tr>
                          <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 16px;">
                            <p style="margin:0;font-size:11px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">Barang diklaim</p>
                            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#dc2626;">${item.title}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">Bukti kepemilikan yang diberikan</p>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                        <tr style="background:#f9fafb;">
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;width:180px;font-size:13px;color:#6b7280;">Warna barang</td>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${warnaBarang}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">Lokasi terakhir hilang</td>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${lokasiTerakhir}</td>
                        </tr>
                        <tr style="background:#f9fafb;">
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">Isi di dalam barang</td>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${isiBarang}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">Ciri-ciri khusus</td>
                          <td style="padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${ciriKhusus}</td>
                        </tr>
                        <tr style="background:#f9fafb;">
                          <td style="padding:12px 14px;font-size:13px;color:#6b7280;">Pesan tambahan</td>
                          <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:500;">${pesanTambahan || '-'}</td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background:#fef9c3;border-left:4px solid #eab308;border-radius:4px;padding:16px;">
                            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#854d0e;">Apa yang harus Anda lakukan?</p>
                            <p style="margin:0 0 14px;font-size:13px;color:#713f12;line-height:1.6;">
                              Jika bukti di atas <strong>COCOK</strong> dengan barang yang Anda pegang, hubungi pemilik langsung via tombol di bawah (atau balas email ini) untuk mengatur janji temu. Jika <strong>TIDAK COCOK</strong>, abaikan saja email ini.
                            </p>
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background:#dc2626;border-radius:4px;">
                                  <a href="mailto:${auth.token.email}?subject=Re: Klaim Barang - ${item.title}"
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
                        Email ini dikirim otomatis oleh sistem <strong>LostnFound</strong>.<br>Balas email ini untuk langsung terhubung dengan pengguna terkait.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
      `,
    })

    return successResponse(null, 'Form klaim berhasil dikirim ke email pemilik')
  } catch {
    return errorResponse('Gagal mengirim form klaim')
  }
}
