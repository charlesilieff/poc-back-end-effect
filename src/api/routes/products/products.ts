import * as Middleware from '@effect/platform/Http/Middleware'
import * as ServerResponse from '@effect/platform/Http/ServerResponse'
import * as Sc from '@effect/schema/Schema'
import { pipe } from 'effect'
import { Effect as T } from 'effect'
import { Api } from 'effect-http'

import { Product, ProductId } from '../../../models/Product.js'

const optionProduct = pipe(
  Api.options('optionProducts', '/products', {
    response: {
      status: 200,
      headers: Sc.struct({
        'Access-Control-Allow-Methods': Sc.string,
        'Access-Control-Allow-Headers': Sc.string
      })
    }
  }, { description: 'CORS handler' })
)

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

export const corsMiddleware = Middleware.make(app =>
  T.flatMap(
    app,
    ServerResponse.setHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    })
  )
)

const productGroup = pipe(
  Api.apiGroup('Products'),
  optionProduct,
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
