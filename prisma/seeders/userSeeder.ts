import { PrismaClient } from '../../src/generated/prisma/client'
import { faker } from '@faker-js/faker'

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding Users with custom specific permissions...')

  // 1. Ambil data Role dari DB
  const roleAdmin = await prisma.role.findUnique({
    where: { roleName: 'ADMIN' },
  })
  const roleUser = await prisma.role.findUnique({ where: { roleName: 'USER' } })
  const roleSuperAdmin = await prisma.role.findUnique({
    where: { roleName: 'SUPERADMIN' },
  })

  // 2. Ambil data Permission dari DB
  const permDashboard = await prisma.permission.findUnique({
    where: { name: 'menu:dashboard' },
  })
  const permCategory = await prisma.permission.findUnique({
    where: { name: 'menu:category' },
  })
  const permUsers = await prisma.permission.findUnique({
    where: { name: 'menu:users' },
  })
  const permHakAkses = await prisma.permission.findUnique({
    where: { name: 'menu:hak-akses' },
  })

  // Action Permissions
  const permCreateCategory = await prisma.permission.findUnique({
    where: { name: 'action:create_category' },
  })
  const permEditCategory = await prisma.permission.findUnique({
    where: { name: 'action:edit_category' },
  })
  const permDeleteReport = await prisma.permission.findUnique({
    where: { name: 'action:delete_report' },
  })

  const adminId = roleAdmin?.id || 1
  const userId = roleUser?.id || 2
  const superAdminId = roleSuperAdmin?.id || 3

  // ==========================================
  // U1: Admin 1 (Hanya Akses Dashboard)
  // ==========================================
  const u1 = await prisma.user.upsert({
    where: { email: 'admin@lostnfound.com' },
    update: {},
    create: {
      name: 'Admin Dashboard Only',
      email: 'admin@lostnfound.com',
      image: faker.image.avatar(),
      roleId: adminId,
    },
  })
  if (permDashboard) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: { userId: u1.id, permissionId: permDashboard.id },
      },
      update: {},
      create: { userId: u1.id, permissionId: permDashboard.id },
    })
  }

  // ==========================================
  // Admin 2: (Akses Kategori, Bisa Create & Edit, Gak Bisa Delete)
  // ==========================================
  const admin2 = await prisma.user.upsert({
    where: { email: 'admin2@lostnfound.com' },
    update: {},
    create: {
      name: 'Admin Category (Create & Edit Only)',
      email: 'admin2@lostnfound.com',
      image: faker.image.avatar(),
      roleId: adminId,
    },
  })
  // Pasang akses masuk menu kategori
  if (permCategory) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: admin2.id,
          permissionId: permCategory.id,
        },
      },
      update: {},
      create: { userId: admin2.id, permissionId: permCategory.id },
    })
  }
  // Pasang akses melakukan CREATE kategori
  if (permCreateCategory) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: admin2.id,
          permissionId: permCreateCategory.id,
        },
      },
      update: {},
      create: { userId: admin2.id, permissionId: permCreateCategory.id },
    })
  }
  // Pasang akses melakukan EDIT kategori (Tambahan Baru)
  if (permEditCategory) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: admin2.id,
          permissionId: permEditCategory.id,
        },
      },
      update: {},
      create: { userId: admin2.id, permissionId: permEditCategory.id },
    })
  }

  // ==========================================
  // U2: User Biasa (Budi Hartono) -> Akses Reports & Hapus Report Sendiri (Opsional)
  // ==========================================
  const u2 = await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      name: 'Budi Hartono',
      email: 'user@mail.com',
      image: faker.image.avatar(),
      roleId: userId,
    },
  })

  // Contoh: Kita berikan hak hapus report ke user biasa ini
  if (permDeleteReport) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: u2.id,
          permissionId: permDeleteReport.id,
        },
      },
      update: {},
      create: { userId: u2.id, permissionId: permDeleteReport.id },
    })
  }

  // ==========================================
  // U3: Super Admin -> Akses Kelola Users & Hak Akses
  // ==========================================
  const u3 = await prisma.user.upsert({
    where: { email: 'lostnfoundteam77@gmail.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'supaah@gmail.com',
      image: faker.image.avatar(),
      roleId: superAdminId,
    },
  })
  if (permUsers && permHakAkses) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: { userId: u3.id, permissionId: permUsers.id },
      },
      update: {},
      create: { userId: u3.id, permissionId: permUsers.id },
    })
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: { userId: u3.id, permissionId: permHakAkses.id },
      },
      update: {},
      create: { userId: u3.id, permissionId: permHakAkses.id },
    })
  }

  return [u1, admin2, u2, u3]
}
