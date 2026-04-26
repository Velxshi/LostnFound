'use client'
import MapHeader from '@/components/common/MapHeader'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { useEffect, useState } from 'react'

const Map = dynamic(() => import('../features/map/components/Map'), {
  ssr: false,
})

export default function Home() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error('Gagal load reports:', err))
  }, [])
  return (
    <>
      <MapHeader />

      <Map data={reports} />
    </>
  )
}
