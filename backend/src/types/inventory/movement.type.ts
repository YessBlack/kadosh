import { ItemSummaryDto } from '@/types/inventory/items.type'
import { UserSummaryDto } from '@/types/user/user/user.type'

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

export interface Movement {
  id: string;
  item_id: string;
  item: ItemSummaryDto;
  createdBy: UserSummaryDto | null;
  type: MovementType;
  quantity: number;
  date: Date;
  source: MovementSource;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
