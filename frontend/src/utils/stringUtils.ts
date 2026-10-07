export const cleanBarcode = (value: string) => value.split(':').pop()?.trim() ?? ''
