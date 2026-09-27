import { RecordModel } from 'pocketbase'
import { User } from '@/types/user/user/user.type'
import { Role } from '@/types/user/permissions/role.type'

export const mapPocketBaseUser = (record: RecordModel, avatarUrl: string): User => ({
  id: record.id,
  email: record.email,
  name: record.name,
  lastname: record.lastname,
  avatar: avatarUrl,
  isActive: record.isActive,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  createdBy: record.createdBy,
  isDeleted: record.isDeleted,
  phone: record.phone,
  lastLogin: record.lastLogin,
  role: record.role as Role
})
