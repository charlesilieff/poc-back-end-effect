import * as Sc from '@effect/schema/Schema'
import { Effect as T, Option as O } from 'effect'
import * as Http from 'effect-http'
import { mockClient } from 'effect-http'

import type { Product } from '../../../../models/Product'
import { ProductId } from '../../../../models/Product'
import { getOneProduct } from '../products'

describe('Product Api', () => {
  it(
    'should get a product',
    async () =>
      await T.gen(function* (_) {
        const productId = Sc.parseSync(ProductId)(1)
        const product: Product = {
          id: productId,
          code: '123',
          category: 'category',
          description: 'description',
          image: O.none(),
          inventoryStatus: 'inventoryStatus',
          name: 'name',
          price: 1,
          quantity: 1,
          rating: 1
        }
        const client = mockClient(getOneProduct(Http.api()), {
          responses: { getOneProduct: product }
        })
        const productGet = yield* _(client.getOneProduct({ params: { id: '1' } }))

        expect(productGet.id).toBe(productId)
      }).pipe(T.runPromise)
  )
})
