import * as Sc from '@effect/schema/Schema'
import { pipe } from 'effect'
import { Api } from 'effect-http'

import { Product } from '../../../models/Product.js'
import { ProductId } from '../../../models/ProductId.js'

const postProducts = pipe(
  Api.post('postProducts', '/products', {
    response: Sc.struct({ data: ProductId }),
    request: { body: Product }
  }, { description: 'Create a new product' })
)

const getProducts = pipe(
  Api.get('getProducts', '/products', {
    response: Sc.struct({ data: Sc.array(Product) })
  }, { description: 'Returns all products' })
)

// IMPORTANT: '/products/:id' is checked at runtime to be a valid path, '/products/:param' will not run

export const getOneProduct = pipe(
  Api.get('getOneProduct', '/products/:id', {
    response: Product,
    request: { params: Sc.struct({ id: Sc.string }) }
  })
)

const patchOneProduct = pipe(
  Api.patch('patchOneProduct', '/products', {
    response: ProductId,
    request: { body: Product }
  })
)

const removeOneProduct = pipe(
  Api.delete('removeOneProduct', '/products/:id', {
    response: ProductId,
    request: { params: Sc.struct({ id: Sc.string }) }
  })
)

const productGroup = pipe(
  Api.apiGroup('Products'),
  // optionProduct,
  postProducts,
  getProducts,
  getOneProduct,
  patchOneProduct,
  removeOneProduct
)
export const ProductsRoutes = pipe(
  Api.api({ title: 'Products Routes' }),
  Api.addGroup(productGroup)
)
export type ProductsRoutes = typeof ProductsRoutes
