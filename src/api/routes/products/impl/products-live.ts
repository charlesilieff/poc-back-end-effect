import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { ProductService } from '../../../../services/products/products-service.js'
import { productRoutes } from '../products.js'

export const ProductRoutes = T.gen(function* (_) {
  const productService = yield* _(ProductService)

  type ProductsRoutes = typeof ProductsRoutes

  const getProductsHandler = productService.getProducts

  const postProductsHandler = ({ body }: Http.Input<ProductsRoutes, 'postProducts'>) =>
    productService.postProducts(body)

  const getOneProductHandler = ({ params }: Http.Input<ProductsRoutes, 'getOneProduct'>) =>
    productService.getOneProduct(params.id)

  const patchOneProductHandler = ({ body }: Http.Input<ProductsRoutes, 'patchOneProduct'>) =>
    productService.patchOneProduct(body)

  const removeOneProductHandler = ({ params }: Http.Input<ProductsRoutes, 'removeOneProduct'>) =>
    productService.removeOneProduct(params.id)

  const ProductsRoutes = pipe(
    Http.api({ title: 'Products Routes' }),
    Http.addGroup(productRoutes)
  )

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
