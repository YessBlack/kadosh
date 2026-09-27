import PocketBase from 'pocketbase'
import { POCKETBASE_URL } from '@/config/env'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'

export const createPocketBaseClient: PocketBaseClientFactory = () => new PocketBase(POCKETBASE_URL)
