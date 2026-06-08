import { PrismaClient } from '@/generated/prisma/client'
import { seedItems } from './seeders/itemSeeder'
import { seedUsers } from './seeders/userSeeder'
import { seedRolePermissions } from './seeders/rolePermissionSeeder' // <-- TAMBAHAN
import { seedNotificationTemplates } from './seeders/notificationTemplateSeeder'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    // 1. Jalankan master Role & Permission terlebih dahulu agar datanya masuk ke DB
    await seedRolePermissions(prisma)

    // 2. Baru jalankan seeder users yang membutuhkan data role & permission di atas
    const users = await seedUsers(prisma)
    const userIds = users.map((u) => u.id)

    // 3. Jalankan seeder lainnya
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
