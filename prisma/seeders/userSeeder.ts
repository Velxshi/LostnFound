import { PrismaClient } from '../../src/generated/prisma/client'
import { faker } from '@faker-js/faker'

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Users...')

  // Buat Role dulu
  const roleAdmin = await prisma.role.upsert({
    where: { id: 'role-admin' }, // Pakai ID statis biar gampang dipanggil di file lain
    update: {},
    create: { id: 'role-admin', roleName: 'ADMIN' },
  })

  const roleUser = await prisma.role.upsert({
    where: { id: 'role-user' },
    update: {},
    create: { id: 'role-user', roleName: 'USER' },
  })

  // Buat 2 User
  const u1 = await prisma.user.upsert({
    where: { email: 'admin@lostnfound.com' },
    update: {},
    create: {
      id: 'user-admin-id',
      googleId: 'google-123',
      name: 'Admin LostnFound',
      email: 'admin@lostnfound.com',
      avatar: faker.image.avatar(),
      roleId: roleAdmin.id,
    },
  })

  const u2 = await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      id: 'user-biasa-id',
      googleId: 'google-456',
      name: 'Budi Hartono',
      email: 'user@mail.com',
      avatar: faker.image.avatar(),
      roleId: roleUser.id,
    },
  })

  return [u1, u2]
}
