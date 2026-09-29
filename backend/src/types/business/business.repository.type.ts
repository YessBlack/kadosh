import { Business, UpdateBusinessRequestDTO } from '@/types/business/business.type'

export interface IBusinessRepository {
  find: () => Promise<Business | null>
  update: (id: string, data: UpdateBusinessRequestDTO) => Promise<Business>
  updateFile: (id: string, file: Blob, fileName: string) => Promise<Business>
}
