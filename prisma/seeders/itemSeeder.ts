import { PrismaClient } from '../../src/generated/prisma/client'
import { fakerID_ID as faker } from '@faker-js/faker' // Pakai locale Indonesia

export async function seedItems(prisma: PrismaClient, userIds: string[]) {
  console.log('Seeding Master Data (Status & Categories)...')

  // 1. Seed Status sesuai request
  const statuses = await Promise.all(
    ['LOST', 'FOUND', 'DONE'].map((name) =>
      prisma.status.upsert({
        where: { id: `status-${name.toLowerCase()}` },
        update: {},
        create: { id: `status-${name.toLowerCase()}`, name },
      }),
    ),
  )

  // 2. Seed Category sesuai request
  const categories = await Promise.all(
    ['Elektronik', 'Dompet', 'Tas', 'Kunci', 'Kartu Identitas'].map((name) =>
      prisma.category.upsert({
        where: { id: `cat-${name.toLowerCase().replace(' ', '-')}` },
        update: {},
        create: { id: `cat-${name.toLowerCase().replace(' ', '-')}`, name },
      }),
    ),
  )

  console.log('Seeding 25 Items in Bandung area...')

  for (let i = 0; i < 25; i++) {
    // Koordinat area Bandung (sekitar -6.9175, 107.6191)
    const lat = faker.location.latitude({ max: -6.8, min: -7.0, precision: 6 })
    const lng = faker.location.longitude({
      max: 107.7,
      min: 107.5,
      precision: 6,
    })

    await prisma.item.create({
      data: {
        title: faker.commerce.productName(),
        linkImage: `https://picsum.photos/seed/${faker.string.uuid()}/400/300`,
        desc: faker.lorem.sentence(),
        // Prisma Decimal butuh string atau number
        latitude: lat,
        longitude: lng,
        statusId: faker.helpers.arrayElement(statuses).id,
        userId: faker.helpers.arrayElement(userIds),
        categoryId: faker.helpers.arrayElement(categories).id,
        locationDetail: `${faker.location.streetAddress()}, Bandung`,
        characteristics: 'Warna ' + faker.color.human(),
        note: faker.helpers.arrayElement([
          'Hubungi satpam depan',
          'Bisa diambil di lobi',
          'Bawa bukti kepemilikan ya',
        ]),
      },
    })
  }
}
