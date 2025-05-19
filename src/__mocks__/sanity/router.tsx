import {jest} from '@jest/globals'

export const useRouter = jest.fn().mockReturnValue({
  navigateIntent: jest.fn(),
})
