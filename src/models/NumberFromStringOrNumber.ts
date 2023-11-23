import * as PR from '@effect/schema/ParseResult'
import * as Sc from '@effect/schema/Schema'

export const NumberFromStringOrNumber = Sc.transformOrFail(
  Sc.union(Sc.string, Sc.number),
  Sc.number,
  numberOrString =>
    typeof numberOrString === 'string' && numberOrString.length === 0 ?
      PR.success(0) :
      Sc.parse(Sc.union(Sc.NumberFromString, Sc.number))(numberOrString),
  PR.success
)
