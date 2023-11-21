import { Layer as L, pipe } from 'effect'

import { MysqlLive } from '../../../repository/products/sql-impl/mysql-live.js'
import { makeProductSqlRepoLive } from '../../../repository/products/sql-impl/sql-product-service-live.js'
import { ProductServiceTest } from '../product-service_spec.js'
import { makeProductServiceLive } from './product-service-live.js'

const layerProductService = pipe(
  MysqlLive,
  L.provide(makeProductSqlRepoLive),
  L.provide(makeProductServiceLive)
)

ProductServiceTest(layerProductService)
