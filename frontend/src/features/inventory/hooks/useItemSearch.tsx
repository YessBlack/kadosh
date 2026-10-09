import { useEffect, useState } from 'react'
import { catalogApi } from '@/features/inventory/api/catalog.api'
import type { Item } from '@/features/inventory/types/catalog.types'

const MIN_CHARS = 2

interface SearchState {
  query: string
  results: Item[]
}

const safeSearch = (q: string): Promise<Item[]> =>
  catalogApi.searchProducts(q).catch(() => [])

export const useItemSearch = (delay = 300) => {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState>({ query: '', results: [] })

  const trimmed = query.trim()
  const isActive = trimmed.length >= MIN_CHARS

  useEffect(() => {
    if (!isActive) return

    let cancelled = false

    const timer = setTimeout(async () => {
      const items = await safeSearch(trimmed)
      if (!cancelled) setState({ query: trimmed, results: items })
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [trimmed, isActive, delay])

  const results = isActive && state.query === trimmed ? state.results : []
  const isSearching = isActive && state.query !== trimmed

  return { query, setQuery, results, isSearching }
}
