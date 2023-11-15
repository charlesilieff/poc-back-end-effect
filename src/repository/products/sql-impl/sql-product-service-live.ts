import { Effect as T, Layer as L } from 'effect'

import { ProductRepositoryService } from '../products.js'

export const makeProductSqlLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    yield* _(T.unit)
    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = () =>
      T.die('Not implemented')

    const getProductsRepo: ProductRepositoryService['getProductsRepo'] = () =>
      T.die('Not implemented')

    const patchOneProductRepo: ProductRepositoryService['patchOneProductRepo'] = () =>
      T.die('Not implemented')

    const postProductsRepo: ProductRepositoryService['postProductsRepo'] = () =>
      T.die('Not implemented')

    const removeOneProductRepo: ProductRepositoryService['removeOneProductRepo'] = () =>
      T.die('Not implemented')

    return ProductRepositoryService.of({
      getOneProductRepo,
      getProductsRepo,
      patchOneProductRepo,
      postProductsRepo,
      removeOneProductRepo
    })
  })
)
