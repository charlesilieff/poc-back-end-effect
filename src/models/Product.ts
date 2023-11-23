import * as Sc from '@effect/schema/Schema'

import { NumberFromStringOrNumber } from './NumberFromStringOrNumber.js'
import { OptionalProductId } from './ProductId.js'

export const Product = Sc.struct({
  id: OptionalProductId,
  code: Sc.string,
  name: Sc.string,
  description: Sc.string,
  price: NumberFromStringOrNumber,
  quantity: NumberFromStringOrNumber,
  inventoryStatus: Sc.literal('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'),
  category: Sc.literal('Accessories', 'Clothing', 'Electronics', 'Fitness'),
  image: Sc.optional(Sc.union(Sc.string, Sc.null)),
  rating: Sc.optional(Sc.union(Sc.number, Sc.null))
})

export interface Product extends Sc.Schema.To<typeof Product> {}
