import * as Sc from '@effect/schema/Schema'
import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'
import { invalidParamsError, invalidResponseError } from 'effect-http/ServerError'

import { ProductId } from '../../../../models/Product.js'
import { ProductService } from '../../../../services/products/products-service.js'
import { ProductsRoutes } from '../products.js'

export const ProductRoutes = T.gen(function* (_) {
  const productService = yield* _(ProductService)

  const getProductsHandler = productService.getProducts

  const postProductsHandler = ({ body }: Http.Input<ProductsRoutes, 'postProducts'>) =>
    productService.createProduct(body)

  const getOneProductHandler = ({ params }: Http.Input<ProductsRoutes, 'getOneProduct'>) =>
    pipe(
      Sc.parse(ProductId)(+params.id),
      T.mapError(parseError => invalidParamsError(parseError.errors)),
      T.flatMap(productId =>
        productService.getOneProduct(productId).pipe(
          T.mapError(() => invalidResponseError('Product not found'))
        )
      )
    )

  const patchOneProductHandler = ({ body }: Http.Input<ProductsRoutes, 'patchOneProduct'>) =>
    productService.patchOneProduct(body)

  const removeOneProductHandler = ({ params }: Http.Input<ProductsRoutes, 'removeOneProduct'>) =>
    productService.removeOneProduct(Sc.parseSync(ProductId)(+params.id))

  return pipe(
    ProductsRoutes,
    Http.server,
    Http.handle('getProducts', getProductsHandler),
    Http.handle('postProducts', postProductsHandler),
    Http.handle('getOneProduct', getOneProductHandler),
    Http.handle('patchOneProduct', patchOneProductHandler),
    Http.handle('removeOneProduct', removeOneProductHandler),
    // Check if all routes are implemented
    Http.exhaustive
  )
})
