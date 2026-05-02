import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedNotificationTemplates(prisma: PrismaClient) {
  const templates = [
    {
      id: 1,
      name: 'BARANG_DITEMUKAN',
      content:
        'Seseorang mengirim informasi mengenai barangmu yang hilang, cek email sekarang.',
    },
    {
      id: 2,
      name: 'KLAIM_PEMILIK',
      content:
        'Seseorang mengaku sebagai pemilik dari barang yang Anda temukan, cek email sekarang.',
    },
  ]

  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    })
  }
  console.log('✅ Notification Templates seeded!')
}
