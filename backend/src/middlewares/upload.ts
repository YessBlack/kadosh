import multer from 'multer'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'

const storage = multer.memoryStorage()
const multerUpload = multer({ storage, limits: { fileSize: MAX_AVATAR_SIZE_BYTES } })

export const uploadSingle = (fieldName: string) => multerUpload.single(fieldName)
export const uploadMultiple = (fieldName: string, max: number) => multerUpload.array(fieldName, max)
