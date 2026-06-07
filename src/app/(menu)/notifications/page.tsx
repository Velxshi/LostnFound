'use client'

import { Loading } from '@/components/admin/loading'
import { BlurFade } from '@/components/ui/blur-fade'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Notification {
  id: number
  isRead: boolean
  createdAt: string
  template: {
    content: string
    name: string
  }
}

interface GroupedNotif {
  label: string
  items: Notification[]
}

function CardNotif({
  data,
  onMarkRead,
  isLoading,
}: {
  data: Notification
  onMarkRead: (id: number) => void
  isLoading: boolean
}) {
  const time = new Date(data.createdAt).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex gap-4 p-5 border-l-8 ${data.isRead ? 'border-(--royale)/20' : 'border-(--royale)'} rounded-xl bg-cream-light`}
    >
      <div
        className={`rounded-xl shrink-0 w-12 h-12 flex items-center justify-center ${data.isRead ? 'bg-cream' : 'bg-primary-light-hover'}`}
      >
        <Icon
          icon={
            data.template.name?.toLowerCase() === 'hilang'
              ? 'material-symbols:person-search'
              : 'mdi:email'
          }
          className={`${data.isRead ? 'text-cream-dark' : 'text-primary'} w-7 h-6`}
        />
      </div>

      <div className="flex flex-col gap-8">
        <p className="font-poppins font-medium text-body text-dark md:text-title2">
          {data.template.content}
        </p>

        <div className="flex justify-between items-center">
          <p className="font-jakarta font-medium text-caption text-cream-dark md:text-body">
            {time}
          </p>

          {data.isRead ? (
            <button className="flex gap-1 items-center text-cream-darker bg-cream rounded-full p-2">
              <Icon icon="ri:check-double-fill" className="h-full w-auto" />
            </button>
          ) : (
            <button
              onClick={() => onMarkRead(data.id)}
              disabled={isLoading}
              className="flex gap-1 items-center text-primary cursor-pointer bg-primary-light-hover hover:bg-(--royale-light-active) transisi rounded-2xl px-3 py-2"
            >
              <Icon icon="material-symbols:check" className="h-full w-auto" />
              <p className="font-jakarta font-medium text-caption md:text-body">
                Tandai Dibaca
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function groupByDay(notifications: Notification[]): GroupedNotif[] {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const fmt = (d: Date) => d.toDateString()

  const groups: Record<string, GroupedNotif> = {
    'Hari Ini': { label: 'Hari Ini', items: [] },
    Kemarin: { label: 'Kemarin', items: [] },
    'Lebih Lama Lagi': { label: 'Lebih Lama Lagi', items: [] },
  }

  for (const notif of notifications) {
    const date = new Date(notif.createdAt)
    const key = fmt(date)

    if (key === fmt(today)) {
      groups['Hari Ini'].items.push(notif)
    } else if (key === fmt(yesterday)) {
      groups['Kemarin'].items.push(notif)
    } else {
      groups['Lebih Lama Lagi'].items.push(notif)
    }
  }

  return Object.values(groups).filter((group) => group.items.length > 0)
}

export default function Notif() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (!res.ok)
          toast.error('Gagal mengambil data, silakan memuat ulang', {
            className:
              'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
            position: 'top-right',
          })
        const data = await res.json()
        setNotifications(data.data)
      } catch (err) {
        toast.error('Gagal mengambil data, silakan memuat ulang', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNotif()
  }, [])

  const handleMarkRead = async (id: number) => {
    setLoadingId(id)

    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
      if (!res.ok)
        toast.error('Gagal menandai dibaca', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })

      toast.success('Berhasil menandai dibaca', {
        className:
          'font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]',
        position: 'top-right',
      })

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      )
    } catch {
      toast.error('Gagal menandai dibaca', {
        className:
          'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
        position: 'top-right',
      })
    } finally {
      setLoadingId(null)
    }
  }

  if (loading) return <Loading />

  const grouped = groupByDay(notifications)

  if (grouped.length === 0)
    return (
      <p className="font-poppins text-center text-cream-dark">
        Tidak ada notifikasi.
      </p>
    )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-9 items-center">
      {grouped.map((group, i) => (
        <BlurFade key={`${group.label}-${i}`} delay={0.25 * (i + 1)} inView>
          <div className="flex flex-col gap-3 max-w-2xl">
            <h4 className="font-poppins font-extrabold text-title2 text-dark md:text-title1">
              {group.label}
            </h4>
            {group.items.map((item) => (
              <CardNotif
                key={item.id}
                data={item}
                onMarkRead={handleMarkRead}
                isLoading={loadingId === item.id}
              />
            ))}
          </div>
        </BlurFade>
      ))}
    </div>
  )
}
