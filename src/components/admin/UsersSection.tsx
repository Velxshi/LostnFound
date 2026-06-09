'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation' // Tambahkan ini untuk redirect
import UserModal from './Dashboard/UserModal'
import { BlurFade } from '../ui/blur-fade'
import { Spinner } from '../ui/spinner'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'
import SearchInput from '@/components/common/button/Search'

interface User {
  id: number
  name: string
  email: string
  role: {
    id: number
    roleName: string
  } | null
}

interface MetaProps {
  currentPage: number
  limit: number
  totalItems: number
  totalPages: number
}

function UsersSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 md:p-9 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
      <div className="flex gap-4 mb-6">
        <div className="h-10 flex-1 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function RoleBadge({
  roleId,
  roleName,
}: {
  roleId: number | null
  roleName: string
}) {
  const colors: Record<number, string> = {
    1: 'bg-purple-50 text-purple-700 border-purple-200/60',
    2: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  }

  const idKey = roleId || 2
  const cls = colors[idKey] || 'bg-blue-50 text-blue-700 border-blue-200/60'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border font-poppins tracking-wide ${cls}`}
    >
      {roleName}
    </span>
  )
}

function CardStatistikUser({
  icon,
  label,
  total,
}: {
  icon: string
  label: string
  total: number
}) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-xs backdrop-blur-md">
      <div className="bg-primary/5 rounded-xl p-3 text-primary">
        <Icon icon={icon} className="text-2xl" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 font-poppins uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800 font-poppins mt-0.5">
          {total}
        </p>
      </div>
    </div>
  )
}

export default function UsersSection() {
  const router = useRouter() // Inisialisasi router
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const isFirstLoad = useRef(true)

  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)

  const [meta, setMeta] = useState<MetaProps>({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  })

  useEffect(() => {
    async function checkCurrentUser() {
      try {
        const res = await fetch('/api/auth/me')
        const result = await res.json()

        if (result.success && result.data?.role?.roleName === 'SUPERADMIN') {
          setIsSuperAdmin(true)
        } else {
          setIsSuperAdmin(false)
          router.push('/forbidden')
        }
      } catch (err) {
        console.error('Gagal memverifikasi session:', err)
        setIsSuperAdmin(false)
        router.push('/forbidden')
      }
    }
    checkCurrentUser()
  }, [router])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)

    return () => clearTimeout(handler)
  }, [search])

  const fetchUsers = useCallback(async () => {
    if (isSuperAdmin === false) return

    try {
      if (isFirstLoad.current) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const res = await fetch(
        `/api/users?page=${page}&limit=${limit}&search=${debouncedSearch}`,
      )
      const result = await res.json()

      if (result.success) {
        setUsers(result.data.data || result.data)

        const apiMeta = result.data?.meta || result.meta
        if (apiMeta) {
          setMeta({
            currentPage: Number(apiMeta.currentPage || 1),
            limit: Number(apiMeta.limit || limit),
            totalItems: Number(apiMeta.totalItems || 0),
            totalPages: Number(apiMeta.totalPages || 1),
          })
        }
      } else {
        toast.error(result.message || 'Gagal mengambil data', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil data, silakan memuat ulang', {
        className:
          'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
      isFirstLoad.current = false
    }
  }, [page, limit, debouncedSearch, isSuperAdmin])

  useEffect(() => {
    if (isSuperAdmin !== null) {
      fetchUsers()
    }
  }, [fetchUsers, isSuperAdmin])

  const handleEdit = (user: User) => {
    if (!isSuperAdmin) return
    setSelectedUser(user)
    setUserModalOpen(true)
  }

  const handleSuccessAction = (message: string) => {
    toast.success(message, {
      className:
        'font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]',
      position: 'top-right',
    })
    fetchUsers()
  }

  const statistikItem = [
    { label: 'Total Pengguna', icon: 'tabler:users', total: meta.totalItems },
    { label: 'Jumlah Role', icon: 'tabler:shield-check', total: 3 },
  ]

  if (isSuperAdmin === null || (isSuperAdmin && loading)) {
    return <UsersSkeleton />
  }

  if (!isSuperAdmin) {
    return <UsersSkeleton />
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-6 md:p-9">
      <BlurFade delay={0.45} inView>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
              Kelola Pengguna
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {statistikItem.map((item) => (
              <CardStatistikUser
                key={item.label}
                icon={item.icon}
                label={item.label}
                total={item.total}
              />
            ))}
          </div>

          <BlurFade delay={0.15} inView>
            <SearchInput
              onSearch={(value: string) => setSearch(value)}
              placeholder="Cari user..."
            />
          </BlurFade>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden relative mt-7">
            {refreshing && (
              <div className="absolute inset-0 flex justify-center items-center z-50 bg-white/70 backdrop-blur-xs">
                <Spinner className="size-6 text-primary" />
              </div>
            )}

            <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr] gap-4 px-6 py-4 bg-gray-50/70 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider">
                Nama Pengguna
              </p>
              <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider">
                Alamat Email
              </p>
              <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider text-center">
                Role
              </p>
              <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider text-center">
                Tindakan
              </p>
            </div>

            {users.length === 0 && (
              <div className="w-full flex flex-col justify-center items-center py-16 text-center">
                <div className="bg-gray-100 p-3 rounded-full text-gray-400 mb-3">
                  <Icon icon="tabler:user-off" className="text-2xl" />
                </div>
                <p className="text-gray-500 font-medium font-poppins">
                  Pengguna tidak ditemukan
                </p>
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 flex flex-col gap-3 md:grid md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr] md:items-center md:gap-4
                            hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-primary/20 to-primary/5 text-primary font-bold font-poppins text-xs rounded-lg w-9 h-9 flex items-center justify-center shrink-0 uppercase tracking-wider shadow-inner">
                      {user.name
                        ? user.name
                            .split(' ')
                            .map((n) => n.charAt(0))
                            .join('')
                            .slice(0, 2)
                        : '?'}
                    </div>
                    <p className="font-semibold text-gray-800 font-poppins text-sm truncate">
                      {user.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 md:text-gray-600">
                    <Icon
                      icon="tabler:mail"
                      className="text-md shrink-0 md:hidden"
                    />
                    <p className="text-sm font-poppins truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 justify-center">
                    <Icon
                      icon="tabler:shield"
                      className="text-md text-gray-400 shrink-0 md:hidden"
                    />
                    <RoleBadge
                      roleId={user.role?.id || null}
                      roleName={user.role?.roleName || 'User'}
                    />
                  </div>

                  <div className="md:text-right mt-1 md:mt-0 flex justify-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#2848b7] hover:bg-(--royale-hover) text-white
                                 font-semibold font-poppins text-xs py-2 px-3.5 rounded-xl border border-gray-200 shadow-xs
                                 active:scale-[0.98] transition-all duration-150 w-full md:w-auto cursor-pointer"
                    >
                      <Icon icon="tabler:edit" className="text-sm" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BlurFade delay={0.55} inView>
            {users.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = page === pageNum
                    const showPage =
                      pageNum === 1 ||
                      pageNum === meta.totalPages ||
                      Math.abs(pageNum - page) <= 1

                    if (!showPage) {
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <span
                            key={pageNum}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm select-none"
                          >
                            ···
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer scale-105 ${
                          isActive
                            ? 'bg-[#2848b7] text-white shadow-md shadow-blue-200'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2848b7] hover:text-[#2848b7] hover:shadow-sm'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, meta.totalPages))
                  }
                  disabled={page === meta.totalPages || meta.totalPages <= 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </BlurFade>
        </div>
      </BlurFade>

      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSuccess={() => handleSuccessAction('Berhasil diubah')}
      />
    </div>
  )
}
