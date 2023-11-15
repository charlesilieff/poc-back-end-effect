import { Effect as T, Layer as L } from 'effect'

import { ProductService } from '../products-service.js'

export const makeProductServiceLive = L.effect(
  ProductService,
  T.gen(function* (_) {
    yield* _(T.unit)
    return ProductService.of({
      getOneProduct: id => T.die(`Not implemented: getOneProduct(${id})`),
      getProducts: () => T.die(`Not implemented: getProducts`),
      patchOneProduct: product => T.die(`Not implemented: patchOneProduct(${product})`),
      postProducts: product => T.die(`Not implemented: postProducts(${product})`),
      removeOneProduct: id => T.die(`Not implemented: removeOneProduct(${id})`)
    })
  })
)
