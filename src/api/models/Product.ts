import * as Sc from '@effect/schema/Schema'

export const Product = Sc.struct({
  id: Sc.number
  // code: Sc.string,
  // name: Sc.string,
  // description: Sc.string,
  // price: Sc.number,
  // quantity: Sc.number,
  // inventoryStatus: Sc.string,
  // category: Sc.string,
  // image: Sc.optional(Sc.string).toOption(),
  // rating: Sc.number
})

export interface Product extends Sc.Schema.To<typeof Product> {}
