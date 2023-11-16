import * as Sc from '@effect/schema/Schema'
import type * as B from 'effect/Brand'

export type ProductId = number & B.Brand<'ProductId'>
export const ProductId = Sc.number.pipe(Sc.brand('ProductId'))

export const Product = Sc.struct({
  id: ProductId,
  code: Sc.string,
  name: Sc.string,
  description: Sc.string,
  price: Sc.number,
  quantity: Sc.number,
  inventoryStatus: Sc.literal('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'),
  category: Sc.literal('Accessories', 'Clothing', 'Electronics', 'Fitness'),
  image: Sc.optional(Sc.string).toOption(),
  rating: Sc.number
})

export interface Product extends Sc.Schema.To<typeof Product> {}
