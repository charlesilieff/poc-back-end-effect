import * as Sc from '@effect/schema/Schema'
import { Effect as T, pipe } from 'effect'
import { RouterBuilder, ServerError } from 'effect-http'

import type { Product } from '../../../../models/Product.js'
import { ProductId } from '../../../../models/Product.js'
import { ProductService } from '../../../../services/products/products-service.js'
import { ProductsRoutes } from '../products.js'

export const ProductRoutes = T.gen(function* (_) {
  const productService = yield* _(ProductService)

  const getProductsHandler = () =>
    T.map(productService.getProducts(), products => ({
      content: { data: products },
      headers: {
        'access-control-allow-origin': '*'
      },
      status: 200 as const
    }))

  const postProductsHandler = ({ body }: { body: Product }) =>
    T.map(productService.createProduct(body), productId => ({
      content: { data: productId },
      headers: {
        'access-control-allow-origin': '*'
      },
      status: 200 as const
    }))

  const getOneProductHandler = ({ params }: { params: { id: string } }) =>
    pipe(
      Sc.parse(ProductId)(+params.id),
      T.mapError(parseError => ServerError.badRequest(parseError.errors)),
      T.flatMap(productId =>
        productService.getOneProduct(productId).pipe(
          T.mapError(e => ServerError.notFoundError(`Product not found : ${e.toStringError()}`))
        )
      )
    )

  const patchOneProductHandler = ({ body }: { body: Product }) =>
    productService.patchOneProduct(body)

  const removeOneProductHandler = ({ params }: { params: { id: string } }) =>
    pipe(
      Sc.parse(ProductId)(+params.id),
      T.mapError(parseError => ServerError.badRequest(parseError.errors)),
      T.flatMap(productId =>
        productService.removeOneProduct(productId).pipe(
          T.mapError(e => ServerError.notFoundError(`Product not found : ${e.toStringError()}`))
        )
      )
    )

  return pipe(
    ProductsRoutes,
    RouterBuilder.make,
    RouterBuilder.handle('getProducts', getProductsHandler),
    RouterBuilder.handle('postProducts', postProductsHandler),
    RouterBuilder.handle('getOneProduct', getOneProductHandler),
    RouterBuilder.handle('patchOneProduct', patchOneProductHandler),
    RouterBuilder.handle('removeOneProduct', removeOneProductHandler),
    RouterBuilder.handle(
      'optionProducts',
      () =>
        T.succeed({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: {
            'access-control-allow-methods': 'GET, POST, OPTIONS, PATCH, DELETE',
            'access-control-allow-origin': '*',
            'access-control-allow-headers': 'Content-Type, Authorization'
          },
          status: 200 as const
        })
    ),
    // Check if all routes are implemented
    RouterBuilder.build
  )
})
