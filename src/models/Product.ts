import * as PR from '@effect/schema/ParseResult'
import * as Sc from '@effect/schema/Schema'
import type * as B from 'effect/Brand'

export type ProductId = number & B.Brand<'ProductId'>
export const ProductId = Sc.number.pipe(Sc.brand('ProductId'))

const OptionalProductId = Sc.transformOrFail(
  Sc.union(Sc.string, Sc.number),
  Sc.union(ProductId, Sc.undefined),
  id =>
    typeof id === 'string' && id.length === 0 && !Number.isNaN(id) ?
      PR.success(undefined) :
      PR.success(+id),
  id =>
    id === undefined ?
      PR.fail(PR.parseError([PR.type(ProductId.ast, id, 'Id is undefined')])) :
      PR.success(id)
)

const NumberFromString = Sc.transformOrFail(
  Sc.union(Sc.string, Sc.number),
  Sc.number,
  number =>
    typeof number === 'string' && number.length === 0 && !Number.isNaN(number) ?
      PR.success(0) :
      PR.success(+number),
  number =>
    number === undefined ?
      PR.fail(PR.parseError([PR.type(ProductId.ast, number, 'Number is undefined')])) :
      PR.success(number)
)

export const Product = Sc.struct({
  id: OptionalProductId,
  code: Sc.string,
  name: Sc.string,
  description: Sc.string,
  price: NumberFromString,
  quantity: NumberFromString,
  inventoryStatus: Sc.literal('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'),
  category: Sc.literal('Accessories', 'Clothing', 'Electronics', 'Fitness'),
  image: Sc.optional(Sc.union(Sc.string, Sc.null)),
  rating: Sc.optional(Sc.union(Sc.number, Sc.null))
})

export interface Product extends Sc.Schema.To<typeof Product> {}
