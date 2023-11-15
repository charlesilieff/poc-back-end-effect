import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { ProductsServer } from './api/routes/products/impl/products-live.js'

// pipe(a,b,c) is equivalent to c(b(a))
const PORT = 3000

pipe(
  ProductsServer,
  // Check if all routes are implemented

  Http.listen({ port: PORT }),
  T.runPromise
  // Http.exhaustive
)
