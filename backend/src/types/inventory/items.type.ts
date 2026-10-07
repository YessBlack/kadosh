export enum ItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

export enum PriceMode {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE'
}

export enum Unit {
  UNIT = 'UNIT',
  KILOGRAM = 'KILOGRAM',
  GRAM = 'GRAM',
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  METER = 'METER',
  BOX = 'BOX',
  PACK = 'PACK'
}

export interface ItemBase {
  id: string;
  type: ItemType;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  salesPrice: number;
  isActive: boolean;
  image?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProductItem extends ItemBase {
  type: ItemType.PRODUCT;
  barcode?: string;
  unit: Unit;
  unitCost: number;
  initialStock: number;
  minStock: number;
}

export interface ServiceItem extends ItemBase {
  type: ItemType.SERVICE;
  priceMode: PriceMode;
  estimatedCost?: number;
  durationMin?: number;
}

export type Item = ProductItem | ServiceItem;
