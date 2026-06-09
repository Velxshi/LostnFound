import { Icon } from '@iconify/react'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface SuggestionItem {
  id: string | number
  title: string
  lat?: number
  lng?: number
}

interface SearchComponentProps {
  onSearch: (value: string) => void
  onSelectSuggestion?: (item: SuggestionItem) => void
  placeholder?: string
}

export default function SearchComponent({
  onSearch,
  onSelectSuggestion,
  placeholder = 'Cari laporan...',
}: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const fetchSuggestions = useCallback(
    (value: string) => {
      onSearch(value)

      if (!value.trim()) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      fetch(`/api/items?search=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let raw: any[] = []
          if (Array.isArray(data.data)) raw = data.data

          const items: SuggestionItem[] = raw.map((item) => ({
            id: item.id,
            title: item.title,
            lat: item.lat ? parseFloat(item.lat) : undefined,
            lng: item.lng ? parseFloat(item.lng) : undefined,
          }))

          setSuggestions(items.slice(0, 6))
          setShowSuggestions(items.length > 0)
        })
        .catch(() => {
          setSuggestions([])
          setShowSuggestions(false)
        })
        .finally(() => setLoading(false))
    },
    [onSearch],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 350)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1)
  }, [suggestions])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target =
        activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0]
      handleSelect(target)
      setActiveIndex(-1)
    }
  }

  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.title)
    onSearch(item.title)
    setShowSuggestions(false)
    onSelectSuggestion?.(item)
    console.log(12)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl bg-cream-light w-full"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon
          icon="material-symbols:search"
          className="w-4 h-4 text-cream-dark"
          width={16}
          height={16}
        />
      </div>
      <input
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        type="text"
        name="search"
        onKeyDown={handleKeyDown}
        className="text-[13px] font-extralight font-poppins w-full pl-12 pr-4 py-4 bg-white outline-none rounded-2xl shadow-sm text-dark placeholder-gray-400"
        placeholder={placeholder}
        autoComplete="off"
      />

      {showSuggestions && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-(--cream) rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <li className="px-4 py-3 text-[12px] font-poppins text-gray-400">
              Mencari...
            </li>
          ) : (
            suggestions.map((item, index) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`px-4 py-3 text-[13px] font-poppins text-dark cursor-pointer flex items-center gap-3 transition-colors ${index === activeIndex ? 'bg-(--cream-hover)' : 'bg-(--cream) hover:bg-(--cream-hover)'}`}
              >
                <span className="truncate">{item.title}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
