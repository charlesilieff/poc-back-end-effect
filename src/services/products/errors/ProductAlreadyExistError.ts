import { TaggedClass } from 'effect/Data'

export class ProductAlreadyExistError
  extends TaggedClass('ProductAlreadyExistError')<{ error: unknown }> {
  override toString!: never
  static of = (error: unknown): ProductAlreadyExistError => new ProductAlreadyExistError({ error })

  toStringError = (): string => `ProductAlreadyExistError: ${this.error}`
}
