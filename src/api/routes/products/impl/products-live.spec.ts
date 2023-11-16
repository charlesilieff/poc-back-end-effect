import * as Sc from '@effect/schema/Schema'
import { Effect as T } from 'effect'
import * as Http from 'effect-http'
import { mockClient } from 'effect-http'

import { ProductId } from '../../../../models/Product'
import { getOneProduct } from '../products'

describe('Product Api', () => {
  it(
    'should get a product',
    async () =>
      await T.gen(function* (_) {
        const productId = Sc.parseSync(ProductId)(1)
        const client = mockClient(getOneProduct(Http.api()), {
          responses: { getOneProduct: { id: productId, code: '123' } }
        })
        const product = yield* _(client.getOneProduct({ params: { id: '1' } }))

        expect(product.id).toBe(productId)
      }).pipe(T.runPromise)
  )
})
