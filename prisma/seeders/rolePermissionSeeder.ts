import { PrismaClient } from '@/generated/prisma/client'

export async function seedRolePermissions(prisma: PrismaClient) {
  console.log('🔑 Seeding Master Roles & Permissions...')

  // 1. Daftarkan Semua Kemungkinan Menu & Aksi Khusus
  const permissionsData = [
    { name: 'menu:dashboard', description: 'Akses halaman dashboard utama' },
    {
      name: 'menu:category',
      description: 'Kelola master data kategori barang',
    },
    { name: 'menu:users', description: 'Kelola data pengguna aplikasi' },
    {
      name: 'menu:hak-akses',
      description: 'Kelola konfigurasi role dan permission aplikasi',
    },

    // Action Permissions Khusus
    {
      name: 'action:create_category',
      description: 'Bisa membuat kategori baru',
    },
    { name: 'action:delete_category', description: 'Bisa menghapus kategori' },
    { name: 'action:edit_category', description: 'Bisa edit kategori' },
    { name: 'action:delete_report', description: 'Bisa menghapus report' },
  ]

  await Promise.all(
    permissionsData.map((perm) =>
      prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      }),
    ),
  )

  // 2. Pastikan Role Dasar Terbuat di Database
  await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: { id: 1, roleName: 'ADMIN' },
  })

  await prisma.role.upsert({
    where: { roleName: 'USER' },
    update: {},
    create: { id: 2, roleName: 'USER' },
  })

  await prisma.role.upsert({
    where: { roleName: 'SUPERADMIN' },
    update: {},
    create: { id: 3, roleName: 'SUPERADMIN' },
  })

  console.log('✅ Master Roles & Permissions Berhasil Disinkronkan!')
}
