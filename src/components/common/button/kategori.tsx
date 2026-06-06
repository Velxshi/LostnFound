'use client'
import { useEffect, useState, useRef } from 'react'
import { CategoryItemProps } from '@/types/categoryItems.types'
import { toast } from 'sonner'

export default function Kategori({
  onCategoryChange,
}: {
  onCategoryChange: (category: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('Kategori')
  const [categories, setCategories] = useState<CategoryItemProps[]>([])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok)
          toast.error('Gagal mengambil data, silakan memuat ulang', {
            className:
              'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
            position: 'top-right',
          })
        const data = await response.json()
        setCategories(data.categories)
      } catch (error) {
        toast.error('Gagal mengambil data, silakan memuat ulang', {
          className:
            'font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]',
          position: 'top-right',
        })
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (category: CategoryItemProps | '') => {
    if (category === '') {
      setSelected('Kategori')
      onCategoryChange('')
    } else {
      setSelected(category.name)
      onCategoryChange(category.id.toString())
    }
    setIsOpen(false)
  }
  return (
    <div ref={ref} className="relative inline-block w-full lg:h-12 ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl bg-cream-light px-5 py-3 text-body font-medium text-dark shadow-sm transition-all hover:bg-[#f7f3f0] active:scale-95 cursor-pointer"
      >
        <span className="font-poppins">{selected}</span>
        <svg
          className={`h-5 w-5 transisi ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-cream-light shadow-lg  animate-in fade-in zoom-in duration-100 ">
          <div className="py-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelect(category)}
                className="block w-full px-5 py-3 text-left text-body text-cream-dark-active hover:bg-[#f7f3f0]  font-poppins transisi cursor-pointer"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
