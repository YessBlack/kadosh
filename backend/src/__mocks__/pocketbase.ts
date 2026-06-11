const mockAuthWithPassword = jest.fn()
const mockClear = jest.fn()

const PocketBase = jest.fn().mockImplementation(() => ({
  collection: jest.fn().mockReturnValue({
    authWithPassword: mockAuthWithPassword
  }),
  authStore: {
    clear: mockClear
  }
}))

export { mockAuthWithPassword, mockClear }
export default PocketBase
