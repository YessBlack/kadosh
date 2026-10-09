import { Input } from '@/components/ui/input'
import { useItemSearch } from '@/features/inventory/hooks/useItemSearch'
import type { Item } from '@/features/inventory/types/catalog.types'

interface ItemSearchInputProps {
  selected: Item | null
  onSelect: (item: Item | null) => void
}

export const ItemSearchInput = ({ selected, onSelect }: ItemSearchInputProps) => {
  const { query, setQuery, results, isSearching } = useItemSearch()

  const showDropdown = query.trim().length >= 2

  if (selected) {
    return (
      <div className='flex h-10 items-center justify-between rounded-lg border border-slate-300 px-3 text-sm dark:border-[#1E1B4B]'>
        <span className='truncate'>
          {selected.name} <span className='text-muted-foreground'>({selected.sku})</span>
        </span>
        <button
          type='button'
          className='ml-3 shrink-0 text-violet-500 hover:text-violet-600'
          onClick={() => {
            onSelect(null)
            setQuery('')
          }}
        >
          Cambiar
        </button>
      </div>
    )
  }

  return (
    <div className='relative'>
      <Input
        placeholder='Busca por nombre, SKU o código de barras'
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoComplete='off'
      />

      {showDropdown && (
        <ul className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-300 bg-white text-sm shadow dark:border-[#1E1B4B] dark:bg-[#151b2C]'>
          {isSearching && (
            <li className='px-3 py-2 text-muted-foreground'>Buscando…</li>
          )}

          {!isSearching && results.length === 0 && (
            <li className='px-3 py-2 text-muted-foreground'>Sin resultados</li>
          )}

          {!isSearching && results.map(item => (
            <li key={item.id}>
              <button
                type='button'
                className='w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-[#1E1B4B]'
                onClick={() => {
                  onSelect(item)
                  setQuery('')
                }}
              >
                {item.name} <span className='text-muted-foreground'>({item.sku})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
