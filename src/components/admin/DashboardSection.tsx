import { BlurFade } from '../ui/blur-fade'
import DetailItem from './detail/detailitem'
import CardItem from '../common/CardItem'
import { useEffect, useState } from 'react'
import { CardItemProps } from '@/types/reportItems.types'
import CardStatistik from './CardStatistik'
import { ChartGraphic } from './Dashboard/ChartGraphic'
import Periodeselect from './Dashboard/Periodeselect'
import { AdminStatsResponse } from '@/types/statsDashboard.types'
import DashboardSkeleton from './Dashboard/DashboardSkeleton'
import { toast } from 'sonner'

export default function DashboardSection() {
  const [items, setItems] = useState<CardItemProps[]>([])
  const [stats, setStats] = useState<AdminStatsResponse>()
  const [periode, setPeriode] = useState<string>('7')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/items')
        if (!res.ok)
          toast.error('Gagal mengambil data barang, silakan memuat ulang', {
            className:
              'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
            position: 'top-right',
          })
        const data = await res.json()
        setItems(data.data)
      } catch (err) {
        toast.error('Gagal mengambil data barang, silakan memuat ulang', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  useEffect(() => {
    fetch(`/api/stats?period=${periode}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
      })
      .catch((err) =>
        toast.error('Gagal mengambil data statistik, silakan memuat ulang', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        }),
      )
  }, [periode])

  const totaldata = stats?.summary?.total_reports || 0

  const totalHilang = stats?.summary?.active_lost_items || 0

  const totalTemuan = stats?.summary?.active_found_items || 0

  const totalDikembalikan = stats?.summary?.returned_items || 0

  const statistikItem = [
    {
      label: 'Total Laporan',
      icon: 'tabler:database',
      total: totaldata,
    },
    {
      label: 'Barang Hilang Aktif',
      icon: 'tabler:package',
      total: totalHilang,
    },
    {
      label: 'Barang Temuan Aktif',
      icon: 'tabler:help-circle',
      total: totalTemuan,
    },
    {
      label: 'Barang Dikembalikan',
      icon: 'material-symbols:handshake-outline',
      total: totalDikembalikan,
    },
  ]

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

  if (loading) return <DashboardSkeleton />

  return (
    <div className="container flex flex-col relative">
      <BlurFade delay={0.15} inView>
        <h1 className="font-poppins font-bold text-title1 text-dark md:text-h4 lg:text-h3">
          Statistik Laporan
        </h1>
      </BlurFade>
      <BlurFade delay={0.45} inView>
        <div className="card-container grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-3 mt-3">
          {statistikItem.map((item) => (
            <CardStatistik
              key={item.label}
              icon={item.icon}
              label={item.label}
              total={item.total}
            />
          ))}
        </div>
      </BlurFade>
      <BlurFade delay={0.55} inView>
        <div className="mt-5 flex flex-row items-center justify-between">
          <h1 className="font-poppins font-bold text-title2 text-dark  lg:text-h5">
            Laporan {periode === '7' ? '7 Hari' : '30 Hari'} Terakhir
          </h1>
          <Periodeselect value={periode} onChange={setPeriode} />
        </div>

        <div className="mt-3bg-cream-light p-4 rounded-xl shadow-sm h-74.5">
          <ChartGraphic periode={periode} />
        </div>
      </BlurFade>
      <BlurFade delay={0.55} inView>
        <div className="mt-5 flex flex-row items-center justify-between">
          <h1 className="font-poppins font-bold text-title2 lg:text-h5 text-dark">
            Laporan Terbaru
          </h1>
          <a
            href="/admin/reports"
            className="font-poppins text-body lg:text-title2 font-semibold text-[#2848B7]"
          >
            Lihat Semua
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {items.map((item) => (
            <CardItem data={item} key={item.id} openDetail={openDetail} />
          ))}
        </div>
      </BlurFade>

      <DetailItem isOpen={popupOpen} onClose={closeDetail} id={selectedItem} />
    </div>
  )
}
