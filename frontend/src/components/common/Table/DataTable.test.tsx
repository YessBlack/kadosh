import { DataTable } from '@/components/common/Table/DataTable'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

interface Row {
  id: string
  name: string
}

describe('DataTable', () => {
  const columns = [{ key: 'name' as const, label: 'Nombre' }]

  it('shows an empty state spanning all data columns', () => {
    render(<DataTable<Row> data={[]} columns={columns} />)

    const emptyCell = screen.getByRole('cell', { name: 'No hay datos para mostrar' })
    expect(emptyCell).toHaveAttribute('colspan', '1')
  })

  it('includes the actions column in the empty state span', () => {
    render(
      <DataTable<Row>
        data={[]}
        columns={columns}
        actions={[{ label: 'Editar', onClick: vi.fn() }]}
      />
    )

    const emptyCell = screen.getByRole('cell', { name: 'No hay datos para mostrar' })
    expect(emptyCell).toHaveAttribute('colspan', '2')
  })
})
