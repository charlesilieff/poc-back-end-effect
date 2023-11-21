import { Layer as L, pipe } from 'effect'

import { makeProductFileSystemRepoLive } from '../../../repository/products/file-impl/file-product-service-live.js'
import { ProductServiceTest } from '../product-service_spec.js'
import { makeProductServiceLive } from './product-service-live.js'

const layerProductService = pipe(
  makeProductFileSystemRepoLive,
  L.provide(makeProductServiceLive)
)

ProductServiceTest(layerProductService)
