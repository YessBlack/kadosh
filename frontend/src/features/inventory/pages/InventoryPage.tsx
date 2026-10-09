import { Outlet } from 'react-router-dom'

export const InventoryPage = () => {
  return (
    <div className='flex flex-col gap-5 p-2'>
      <header>
        <h1 className='font-bold text-2xl m-0'>Inventario</h1>
        <p className='text-muted-foreground m-0 text-sm italic'>
          Consulta existencias, registra movimientos y administra el catálogo de productos.
        </p>
      </header>
      <Outlet />
    </div>
  )
}
