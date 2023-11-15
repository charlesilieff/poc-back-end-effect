import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { productRoutes } from '../products.js'

const getProductsHandler = () => T.succeed([{ id: 2 }])

const postProductsHandler = () => T.succeed(1)

const getOneProductHandler = () => T.succeed({ id: 2 })

const patchOneProductHandler = () => T.succeed(1)

const removeOneProductHandler = () => T.succeed(1)

type ProductsRoutes = typeof ProductsRoutes

export const ProductsRoutes = pipe(
  Http.api({ title: 'Products Routes' }),
  Http.addGroup(productRoutes)
)

export const ProductsServer = pipe(
  ProductsRoutes,
  Http.server,
  Http.handle('getProducts', getProductsHandler),
  Http.handle('postProducts', postProductsHandler),
  Http.handle('getOneProduct', getOneProductHandler),
  Http.handle('patchOneProduct', patchOneProductHandler),
  Http.handle('removeOneProduct', removeOneProductHandler),
  Http.exhaustive
)
