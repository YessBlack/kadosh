import { Business, UpdateBusinessRequestDTO } from '@/types/business/business.type'

export interface IBusinessService {
  get: () => Promise<Business>
  update: (input: UpdateBusinessRequestDTO) => Promise<Business>
  updateLogo: (id:string, file: Blob, fileName: string) => Promise<Business>
}
