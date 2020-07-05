import sum from "./sum"

test('should return false given external link', () => {
  expect(sum(1, 2)).toBe(3)
})

test('should return true given internal link', () => {
  expect(sum(3, 4)).toBe(7)
})