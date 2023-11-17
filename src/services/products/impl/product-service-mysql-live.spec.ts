import { Layer as L, pipe } from 'effect'

import { MysqlLive } from '../../../repository/products/sql-impl/mysql-live.js'
import { makeProductSqlLive } from '../../../repository/products/sql-impl/sql-product-service-live.js'
import { ProductServiceTest } from '../product-service-mysql_spec.js'
import { makeProductServiceLive } from './product-service-mysql-live.js'

const layerProductService = pipe(
  MysqlLive,
  L.provide(makeProductSqlLive),
  L.provide(makeProductServiceLive)
)

ProductServiceTest(layerProductService)
