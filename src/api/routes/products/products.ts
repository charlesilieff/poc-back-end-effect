import * as Sc from '@effect/schema/Schema'
import { pipe } from 'effect'
import * as Http from 'effect-http'

import { Product, ProductId } from '../../../models/Product'

const postProducts = pipe(
  Http.post('postProducts', '/products', {
    response: ProductId,
    request: { body: Product }
  }, { description: 'Create a new product' })
)

const getProducts = pipe(
  Http.get('getProducts', '/products', {
    response: Sc.array(Product)
  }, { description: 'Returns all products' })
)

// IMPORTANT: '/products/:id' is checked at runtime to be a valid path, '/products/:pram' will not run

const getOneProduct = pipe(
  Http.get('getOneProduct', '/products/:id', {
    response: Product,
    request: { params: Sc.struct({ id: Sc.string }) }
  })
)

const patchOneProduct = pipe(
  Http.patch('patchOneProduct', '/products', {
    response: ProductId,
    request: { body: Product }
  })
)

const removeOneProduct = pipe(
  Http.delete('removeOneProduct', '/products/:id', {
    response: ProductId,
    request: { params: Sc.struct({ id: Sc.string }) }
  })
)

export const productRoutes = pipe(
  Http.apiGroup('Products'),
  postProducts,
  getProducts,
  getOneProduct,
  patchOneProduct,
  removeOneProduct
)
