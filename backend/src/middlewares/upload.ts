import multer from 'multer'

const storage = multer.memoryStorage()
const multerUpload = multer({ storage })

export const uploadSingle = (fieldName: string) => multerUpload.single(fieldName)
export const uploadMultiple = (fieldName: string, max: number) => multerUpload.array(fieldName, max)
