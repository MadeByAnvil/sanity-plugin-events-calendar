// Add custom Jest matchers for assertions on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Mock Sanity's router
jest.mock('sanity/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    navigateIntent: jest.fn(),
  }),
}))

// Mock CSS modules
jest.mock('styled-components', () => {
  const original = jest.requireActual('styled-components')
  return {
    ...original,
    createGlobalStyle: jest.fn().mockImplementation(() => () => null),
  }
})

// Any global mocks or setup needed for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
