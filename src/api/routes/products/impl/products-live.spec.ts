import * as Sc from '@effect/schema/Schema'
import { Effect as T } from 'effect'
import { Api, MockClient } from 'effect-http'
import { describe, expect, it } from 'vitest'

import type { Product } from '../../../../models/Product.js'
import { ProductId } from '../../../../models/ProductId.js'
import { getOneProduct } from '../products.js'

describe('Product Api', () => {
  it(
    'should get a product',
    async () =>
      await T.gen(function* (_) {
        const productId = Sc.parseSync(ProductId)(1)
        const product: Product = {
          id: productId,
          code: '123',
          category: 'Accessories',
          description: 'description',
          image: undefined,
          inventoryStatus: 'INSTOCK',
          name: 'name',
          price: 1,
          quantity: 1,
          rating: 1
        }
        const client = MockClient.make(getOneProduct(Api.api()), {
          responses: { getOneProduct: product }
        })
        const productGet = yield* _(client.getOneProduct({ params: { id: '1' } }))

        expect(productGet.id).toBe(productId)
      }).pipe(T.runPromise)
  )
})
