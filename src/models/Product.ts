import * as PR from '@effect/schema/ParseResult'
import * as Sc from '@effect/schema/Schema'
import type * as B from 'effect/Brand'

export type ProductId = number & B.Brand<'ProductId'>
export const ProductId = Sc.number.pipe(Sc.brand('ProductId'))

const OptionalProductId = Sc.transformOrFail(
  Sc.union(Sc.string, Sc.number),
  Sc.union(ProductId, Sc.undefined),
  id => typeof id === 'string' && id.length === 0 ? PR.success(undefined) : PR.success(+id),
  id =>
    id === undefined ?
      PR.fail(PR.parseError([PR.type(ProductId.ast, id, 'Id is undefined')])) :
      PR.success(id)
)

export const Product = Sc.struct({
  id: OptionalProductId,
  code: Sc.string,
  name: Sc.string,
  description: Sc.string,
  price: Sc.number,
  quantity: Sc.number,
  inventoryStatus: Sc.literal('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'),
  category: Sc.literal('Accessories', 'Clothing', 'Electronics', 'Fitness'),
  image: Sc.optional(Sc.string),
  rating: Sc.optional(Sc.number)
})

export interface Product extends Sc.Schema.To<typeof Product> {}
