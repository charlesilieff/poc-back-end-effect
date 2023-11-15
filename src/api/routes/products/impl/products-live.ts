import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { productRoutes } from '../products.js'

const getProductsHandler = () => T.succeed([{ id: 2 }])

type ProductsRoutes = typeof ProductsRoutes

export const ProductsRoutes = pipe(
  Http.api({ title: 'Products Routes' }),
  Http.addGroup(productRoutes)
)

export const ProductsServer = pipe(
  ProductsRoutes,
  Http.server,
  Http.handle('getProducts', getProductsHandler),
  Http.exhaustive
)
