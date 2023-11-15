import * as Sc from '@effect/schema/Schema'
import { pipe } from 'effect'
import * as Http from 'effect-http'

import { Product } from '../models/Product.js'

// const postProducts = pipe(
//   Http.post('postProducts', '/products', {
//     response: Sc.number,
//     request: { body: Product }
//   })
// )

const getProducts = pipe(
  Http.get('getProducts', '/products', {
    response: Sc.array(Product)
  })
)

// const getOneProduct = pipe(
//   Http.get('getOneProduct', '/products', {
//     response: Product,
//     request: { params: Sc.struct({ id: Sc.number }) }
//   })
// )

// const patchOneProduct = pipe(
//   Http.patch('patchProduct', '/products', {
//     response: Product,
//     request: { params: Sc.struct({ id: Sc.number }) }
//   })
// )

// const removeOneProduct = pipe(
//   Http.delete('removeProduct', '/products', {
//     response: Product,
//     request: { params: Sc.struct({ id: Sc.number }) }
//   })
// )

export const productRoutes = pipe(
  Http.apiGroup('Products'),
  // postProducts,
  getProducts
  // getOneProduct,
  // patchOneProduct,
  // removeOneProduct
)
