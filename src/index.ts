import { Effect as T, pipe } from 'effect'
import * as Http from 'effect-http'

import { ProductRoutes } from './api/routes/products/impl/products-live.js'
import { MigrationLayer, MysqlLive } from './repository/products/sql-impl/mysql-live.js'
import { makeProductSqlLive } from './repository/products/sql-impl/sql-product-service-live.js'
import { makeProductServiceLive } from './services/products/impl/product-service-live.js'

const PORT = 3000

// pipe(a,b,c) is equivalent to c(b(a))

pipe(
  ProductRoutes,
  T.provide(makeProductServiceLive),
  T.provide(makeProductSqlLive),
  T.provide(MigrationLayer),
  T.provide(MysqlLive),
  T.flatMap(Http.listen({ port: PORT })),
  T.runPromise
)
