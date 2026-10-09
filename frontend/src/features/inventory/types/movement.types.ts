export enum MovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum MovementSource {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT',
  MANUAL = 'MANUAL',
  RETURN_IN = 'RETURN_IN',
  RETURN_OUT = 'RETURN_OUT'
}

export const SOURCE_ALLOWED_TYPES: Record<MovementSource, MovementType[]> = {
  [MovementSource.PURCHASE]: [MovementType.IN],
  [MovementSource.SALE]: [MovementType.OUT],
  [MovementSource.ADJUSTMENT]: [MovementType.IN, MovementType.OUT],
  [MovementSource.MANUAL]: [MovementType.IN, MovementType.OUT],
  [MovementSource.RETURN_IN]: [MovementType.IN],
  [MovementSource.RETURN_OUT]: [MovementType.OUT]
}

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MovementType.IN]: 'Entrada',
  [MovementType.OUT]: 'Salida'
}

export const MOVEMENT_SOURCE_LABELS: Record<MovementSource, string> = {
  [MovementSource.PURCHASE]: 'Compra',
  [MovementSource.SALE]: 'Venta',
  [MovementSource.ADJUSTMENT]: 'Ajuste',
  [MovementSource.MANUAL]: 'Manual',
  [MovementSource.RETURN_IN]: 'Devolución de entrada',
  [MovementSource.RETURN_OUT]: 'Devolución de salida'
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  item: { id: string; name: string; unitCost: number } | null;
  createdBy: { id: string; name: string } | null;
  type: MovementType;
  quantity: number;
  date: string;
  source?: MovementSource;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
