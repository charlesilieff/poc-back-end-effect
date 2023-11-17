import { TaggedError } from 'effect/Data'

export class ProductNotFoundError extends TaggedError('ProductNotFoundError')<{ error: unknown }> {
  static of = (error: unknown): ProductNotFoundError => new ProductNotFoundError({ error })

  toStringError = (): string => `ProductNotFoundError: ${this.error}`
}
