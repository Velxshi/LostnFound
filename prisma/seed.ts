import { PrismaClient } from '@/generated/prisma/client'
import { seedItems } from './seeders/itemSeeder'
import { seedUsers } from './seeders/userSeeder'
import { PrismaPg } from '@prisma/adapter-pg'
import { seedNotificationTemplates } from './seeders/notificationTemplateSeeder'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const users = await seedUsers(prisma)
    const userIds = users.map((u) => u.id)

    await seedNotificationTemplates(prisma)
    await seedItems(prisma, userIds)

    console.log('✅ Semua seeder berhasil dijalankan!')
  } catch (error) {
    console.error('❌ Error pas seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
