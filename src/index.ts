import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { productRoutes } from './api/routes/products.js'

const server = pipe(
  Http.api({ title: 'Alten back-end' }),
  Http.addGroup(productRoutes),
  Http.server,
  Http.handle('getProducts', () => T.succeed([{ id: 2 }])),
  Http.exhaustive
  // Check if all routes are implemented
  // Http.exhaustive
)

pipe(
  server,
  Http.listen({ port: 3000 }),
  T.runPromise
)
