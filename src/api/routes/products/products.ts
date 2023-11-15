import * as Sc from '@effect/schema/Schema'
import { pipe } from 'effect'
import * as Http from 'effect-http'

import { Product } from '../../models/Product.js'

const postProducts = pipe(
  Http.post('postProducts', '/products', {
    response: Sc.number,
    request: { body: Product }
  }, { description: 'Create a new product' })
)

const getProducts = pipe(
  Http.get('getProducts', '/products', {
    response: Sc.array(Product)
  }, { description: 'Returns all products' })
)

const getOneProduct = pipe(
  Http.get('getOneProduct', '/products', {
    response: Product,
    request: { params: Sc.struct({ id: Sc.number }) }
  })
)

const patchOneProduct = pipe(
  Http.patch('patchOneProduct', '/products', {
    response: Sc.number,
    request: { body: Product }
  })
)

const removeOneProduct = pipe(
  Http.delete('removeOneProduct', '/products', {
    response: Sc.number,
    request: { params: Sc.struct({ id: Sc.number }) }
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