import { expect, test } from 'vitest'
import sum from './../src/utilities/sum'

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
})