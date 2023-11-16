import * as Sc from '@effect/schema/Schema'
import { Effect as T, pipe } from 'effect'
import { RouterBuilder, ServerError } from 'effect-http'

import type { Product } from '../../../../models/Product.js'
import { ProductId } from '../../../../models/Product.js'
import { ProductService } from '../../../../services/products/products-service.js'
import { ProductsRoutes } from '../products.js'

export const ProductRoutes = T.gen(function* (_) {
  const productService = yield* _(ProductService)

  RouterBuilder.handle

  const getProductsHandler = productService.getProducts

  const postProductsHandler = ({ body }: { body: Product }) => productService.createProduct(body)

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
    // Check if all routes are implemented
    RouterBuilder.build
  )
})
