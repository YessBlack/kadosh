export const mockAuthWithPassword = jest.fn()
export const mockClear = jest.fn()
export const mockGetFullList = jest.fn()
export const mockGetOne = jest.fn()
export const mockGetFirstListItem = jest.fn()
export const mockCreate = jest.fn()
export const mockUpdate = jest.fn()

const PocketBase = jest.fn().mockImplementation(() => ({
  collection: jest.fn().mockReturnValue({
    authWithPassword: mockAuthWithPassword,
    getFullList: mockGetFullList,
    getOne: mockGetOne,
    getFirstListItem: mockGetFirstListItem,
    create: mockCreate,
    update: mockUpdate
  }),
  authStore: {
    clear: mockClear
  }
}))

export default PocketBase
