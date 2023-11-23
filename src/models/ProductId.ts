import * as PR from '@effect/schema/ParseResult'
import * as Sc from '@effect/schema/Schema'
import type * as B from 'effect/Brand'

export type ProductId = number & B.Brand<'ProductId'>
export const ProductId = Sc.number.pipe(Sc.brand('ProductId'))

export const OptionalProductId = Sc.transformOrFail(
  Sc.union(Sc.string, Sc.number),
  Sc.union(ProductId, Sc.undefined),
  id =>
    typeof id === 'string' && id.length === 0 && !Number.isNaN(id) ?
      PR.success(undefined) :
      PR.success(+id),
  id =>
    id === undefined ?
      PR.fail(PR.parseError([PR.type(ProductId.ast, id, 'Id is undefined')])) :
      PR.success(id)
)
