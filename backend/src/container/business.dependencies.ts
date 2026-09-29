import { BusinessRepository } from '@/repositories/business/business.repository'
import { createPocketBaseClient } from '@/config/pocketbase'
import { BusinessService } from '@/services/business/business.service'
import { BusinessController } from '@/controllers/business/business.controller'

const businessRepository = new BusinessRepository(createPocketBaseClient)
const businessService = new BusinessService(businessRepository)

export const businessController = new BusinessController(businessService)
