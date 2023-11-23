import * as A from '@effect/schema/Arbitrary'
import * as Sc from '@effect/schema/Schema'
import * as O from 'effect/Option'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { NumberFromStringOrNumber } from './NumberFromStringOrNumber.js'

describe('Decode number from number or string', () => {
  // @ts-expect-error weird type error
  const arbitraryNumber = A.to(Sc.number)(fc)
  // @ts-expect-error weird type error
  const numberToDecoder = fc.sample(arbitraryNumber, 1)[0]
  it(
    'should decode a number from a number',
    () => {
      const numberDecode = Sc.parseOption(NumberFromStringOrNumber)(numberToDecoder)

      expect(O.getOrUndefined(numberDecode)).toEqual(numberToDecoder)
    }
  )

  it(
    'should decode a number from a string',
    () => {
      const numberDecode = Sc.parseOption(NumberFromStringOrNumber)(numberToDecoder.toString())

      expect(O.getOrUndefined(numberDecode)).toEqual(numberToDecoder)
    }
  )
  it(
    'should decode a empty string to 0',
    () => {
      const numberDecode = Sc.parseOption(NumberFromStringOrNumber)('')

      expect(O.getOrUndefined(numberDecode)).toEqual(0)
    }
  )

  it(
    'should fail when decode a string who is not a number',
    () => {
      // @ts-expect-error weird type error
      const arbitraryString = A.to(Sc.string)(fc)
      // @ts-expect-error weird type error
      const stringDecode = fc.sample(arbitraryString, 1)[0] + 't'

      const numberDecoder = Sc.parseOption(NumberFromStringOrNumber)(stringDecode)

      expect(O.isNone(numberDecoder)).toBe(true)
    }
  )
})
