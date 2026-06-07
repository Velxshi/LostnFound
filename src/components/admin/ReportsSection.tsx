'use client'
import { useEffect, useState } from 'react'
import { BlurFade } from '../ui/blur-fade'
import SearchInput from '@/components/common/button/Search'
import Urutstatus from '@/components/common/button/urutStatus'
import Kategori from '@/components/common/button/kategori'
import { ItemsResponse } from '@/types/reportItems.types'
import CardItem from '../common/CardItem'
import DetailItem from './detail/detailitem'
import { usePathname } from 'next/navigation'
import ReportsSkeleton from './Reports/ReportsSkeleton'
import { toast } from 'sonner'

export default function ReportSection() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const pathname = usePathname()
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const [sort, setSort] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectCategory, setSelectCategory] = useState('')
  const [items, setItems] = useState<ItemsResponse | null>(null)
  const isAdmin = pathname === '/admin/reports'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const type = isAdmin ? '' : '&type=me'

    fetch(
      `/api/items?page=${currentPage}${type}&search=${search}&categoryId=${selectCategory}&sort=${sort}&statusId=${status}`,
    )
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) =>
        toast.error('Gagal mengambil data, silakan memuat ulang', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        }),
      )
      .finally(() => setLoading(false))
  }, [currentPage, search, selectCategory, sort, status, isAdmin])
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  function openDetail(id: number) {
    setSelectedItem(id)
    setPopupOpen(true)
  }

  function closeDetail() {
    setPopupOpen(false)
    setSelectedItem(null)
  }

  useEffect(() => {
    const val = sessionStorage.getItem('showSuccessToast')
    if (val === 'done') {
      setTimeout(() => {
        toast.success('Berhasil menandai selesai', {
          className:
            'font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })
      }, 100)
      sessionStorage.removeItem('showSuccessToast')
    }
  }, [])

  if (loading) return <ReportsSkeleton />
  return (
    <div className="w-full">
      <div className="flex flex-col w-full mx-auto">
        <BlurFade delay={0.15} inView>
          <SearchInput onSearch={(value: string) => setSearch(value)} />
        </BlurFade>
        <div className="pt-5 relative z-20">
          <BlurFade delay={0.45} inView>
            <Urutstatus
              sortItem={(val) => {
                setSort(val.toLowerCase())
                setCurrentPage(1)
              }}
              statusItem={(id) => {
                setStatus(id)
                setCurrentPage(1)
              }}
            />
          </BlurFade>
        </div>
        <div className="pt-5 relative z-10">
          <BlurFade delay={0.45} inView>
            <Kategori
              value={selectCategory}
              onCategoryChange={(cat: string) => {
                setSelectCategory(cat)
                setCurrentPage(1)
              }}
            />
          </BlurFade>
        </div>

        <BlurFade delay={0.55} inView>
          {items?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p className="text-sm font-medium">
                Belum ada laporan yang dibuat
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {items?.data.map((item) => (
                <CardItem data={item} key={item.id} openDetail={openDetail} />
              ))}
            </div>
          )}
        </BlurFade>

        <BlurFade delay={0.55} inView>
          {(items?.data?.length ?? 0) > 0 && items?.pagination && (
            <div className="flex justify-center items-center gap-2 mt-12 pb-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
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
                {Array.from(
                  { length: items.pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer scale-105  ${
                      currentPage === page
                        ? 'bg-[#2848b7] text-white shadow-md shadow-blue-200'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2848b7] hover:text-[#2848b7] hover:shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, items.pagination.totalPages),
                  )
                }
                disabled={currentPage === items.pagination.totalPages}
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
      <DetailItem isOpen={popupOpen} onClose={closeDetail} id={selectedItem} />
    </div>
  )
}
