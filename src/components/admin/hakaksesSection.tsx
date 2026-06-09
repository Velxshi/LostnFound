    'use client'

    import { useCallback, useEffect, useRef, useState } from 'react'
    import { useRouter } from 'next/navigation'
    import { BlurFade } from '../ui/blur-fade'
    import { Spinner } from '../ui/spinner'
    import { toast } from 'sonner'
    import { Icon } from '@iconify/react'
    import SearchInput from '@/components/common/button/Search'
import HakAksesModal from './hak-akses/hakaksesModal'

    interface Permission {
    id: number
    name: string
    description: string
    }

    interface Role {
    id: number
    name?: string
    email?: string
    role?: { id: number; roleName: string } 
    permissions: Permission[]
    }

    interface MetaProps {
    currentPage: number
    limit: number
    totalItems: number
    totalPages: number
    }

    const ALL_PERMISSIONS: Permission[] = [
    { id: 1, name: 'Kelola Pengguna', description: 'Tambah, edit, hapus pengguna' },
    { id: 2, name: 'Kelola Produk', description: 'Tambah, edit, hapus produk' },
    { id: 3, name: 'Kelola Transaksi', description: 'Lihat & proses transaksi' },
    { id: 4, name: 'Kelola Laporan', description: 'Akses laporan & statistik' },
    { id: 5, name: 'Kelola Pengaturan', description: 'Ubah konfigurasi sistem' },
    { id: 6, name: 'Kelola Hak Akses', description: 'Atur role & permission' },
    ]

    function HakAksesSkeleton() {
    return (
        <div className="w-full min-h-screen p-6 md:p-9 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
        <div className="flex gap-4 mb-6">
            <div className="h-10 flex-1 bg-gray-200 rounded-lg" />
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-gray-200 rounded-xl" />
            ))}
        </div>
        </div>
    )
    }



    function CardStatistikHakAkses({
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


    export default function HakAksesSection() {
    const router = useRouter()
    const [roles, setRoles] = useState<Role[]>([])
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const isFirstLoad = useRef(true)

    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null)

    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(12)

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

    const fetchRoles = useCallback(async () => {
    if (isSuperAdmin === false) return

    try {
        if (isFirstLoad.current) setLoading(true)
        else setRefreshing(true)

        const res = await fetch(`/api/hak-akses?page=${page}&limit=${limit}&search=${debouncedSearch}`)
        const result = await res.json()


        const fetchedData = Array.isArray(result) ? result : (result.data || [])

        setRoles(fetchedData)

        setMeta({
        currentPage: page,
        limit: limit,
        totalItems: fetchedData.length, 
        totalPages: 1, 
        })

    } catch (err) {
        console.error(err)
        toast.error('Gagal mengambil data')
    } finally {
        setLoading(false)
        setRefreshing(false)
        isFirstLoad.current = false
    }
    }, [page, limit, debouncedSearch, isSuperAdmin])

    useEffect(() => {
        if (isSuperAdmin !== null) {
        fetchRoles()
        }
    }, [fetchRoles, isSuperAdmin])

    const handleEdit = (role: Role) => {
        if (!isSuperAdmin) return
        setSelectedRole(role)
        setModalOpen(true)
    }

    const handleSuccessAction = (message: string) => {
        toast.success(message, {
        className:
            'font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]',
        position: 'top-right',
        })
        fetchRoles()
    }

    const statistikItem = [
        { label: 'Total Admin', icon: 'tabler:shield-check', total: meta.totalItems },
        {
        label: 'Total Permission',
        icon: 'tabler:lock-open',
        total: ALL_PERMISSIONS.length,
        },
    ]

    if (loading || isSuperAdmin === null) return <HakAksesSkeleton />

    return (
        <div className="w-full min-h-screen bg-gray-50/50 p-6 md:p-9">
        <BlurFade delay={0.45} inView>
            <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
                Hak Akses
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {statistikItem.map((item) => (
                <CardStatistikHakAkses
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
                placeholder="Cari role..."
                />
            </BlurFade>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden relative mt-7">
                {refreshing && (
                <div className="absolute inset-0 flex justify-center items-center z-50 bg-white/70 backdrop-blur-xs">
                    <Spinner className="size-6 text-primary" />
                </div>
                )}

                <div className="hidden md:grid md:grid-cols-[1fr_1.8fr_1fr_0.8fr] gap-4 px-6 py-4 bg-gray-50/70 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider">
                    Nama
                </p>
                <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider">
                    Permission Aktif
                </p>
                <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider text-center">
                    Jumlah Akses
                </p>
                <p className="text-xs font-bold text-gray-400 font-poppins uppercase tracking-wider text-center">
                    Tindakan
                </p>
                </div>

                {roles.length === 0 && (
                <div className="w-full flex flex-col justify-center items-center py-16 text-center">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-400 mb-3">
                    <Icon icon="tabler:shield-off" className="text-2xl" />
                    </div>
                    <p className="text-gray-500 font-medium font-poppins">
                    Role tidak ditemukan
                    </p>
                </div>
                )}

                <div className="divide-y divide-gray-100">
            {roles.map((role) => (
    <div
        key={role.id}
        className="px-6 py-4 flex flex-col gap-3 md:grid md:grid-cols-[1fr_1.8fr_1fr_0.8fr] md:items-center md:gap-4
                hover:bg-gray-50/50 transition-colors duration-200"
    >
        <div className="flex items-center gap-3">
        <div className="bg-linear-to-tr from-primary/20 to-primary/5 text-primary font-bold font-poppins text-xs rounded-lg w-10 h-10 flex items-center justify-center shrink-0 uppercase tracking-wider shadow-inner">
            {role.name ? role.name.charAt(0) : 'U'}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 font-poppins truncate">
            {role.name || 'Tanpa Nama'}
            </span>
            <span className="text-xs text-gray-400 font-poppins truncate">
            {role.email || '-'}
            </span>
        </div>
        </div>

     <div className="flex flex-wrap items-center gap-1.5">
  {role.permissions.length > 0 ? (
    <>
      {role.permissions.map((perm) => {
        const cleanedName = perm.name.replace(/^(menu:|action:)/, '');
        return (
          <span
            key={perm.id}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 font-poppins first-letter:uppercase"
          >
            {cleanedName}
          </span>
        );
      })}

    </>
  ) : (
    <span className="text-xs text-gray-400 font-poppins italic">
      Tidak ada permission
    </span>
  )}
</div>  

        <div className="flex items-center justify-center gap-1.5">
        <Icon
            icon="tabler:lock"
            className="text-md text-gray-400 shrink-0 md:hidden"
        />
        <span className="text-sm font-semibold font-poppins text-gray-700">
            {role.permissions.length}
            <span className="text-gray-400 font-normal">
            /{ALL_PERMISSIONS.length}
            </span>
        </span>
        </div>

        <div className="md:text-right mt-1 md:mt-0 flex justify-center">
        <button
            onClick={() => handleEdit(role)}
            className="inline-flex items-center justify-center gap-1.5 bg-[#2848b7] hover:bg-(--royale-hover) text-white
                    font-semibold font-poppins text-xs py-2 px-3.5 rounded-xl border border-gray-200 shadow-xs
                    active:scale-[0.98] transition-all duration-150 w-full md:w-auto cursor-pointer"
        >
            <Icon icon="tabler:shield-cog" className="text-sm" />
            Atur
        </button>
        </div>
    </div>
    ))}
                </div>
            </div>

            <BlurFade delay={0.55} inView>
                {roles.length > 0 && (
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

        <HakAksesModal
            isOpen={modalOpen}
            onClose={() => {
            setModalOpen(false)
            setSelectedRole(null)
            }}
            role={selectedRole}
            onSuccess={handleSuccessAction}
        />
        </div>
    )
    }