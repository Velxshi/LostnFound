import { PrismaClient } from '../../src/generated/prisma/client'
import { faker } from '@faker-js/faker'

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Users...')

  // Role (tanpa set id manual)
  const roleAdmin = await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: { roleName: 'ADMIN' },
  })

  const roleUser = await prisma.role.upsert({
    where: { roleName: 'USER' },
    update: {},
    create: { roleName: 'USER' },
  })

  // Users
  const u1 = await prisma.user.upsert({
    where: { email: 'admin@lostnfound.com' },
    update: {},
    create: {
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
      googleId: 'google-456',
      name: 'Budi Hartono',
      email: 'user@mail.com',
      avatar: faker.image.avatar(),
      roleId: roleUser.id,
    },
  })

  return [u1, u2]
}