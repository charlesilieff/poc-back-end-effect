import { tag } from '@sqlfx/mysql'
import { flatMap } from 'effect/Effect'

export default flatMap(
  tag,
  sql =>
    sql`
    CREATE TABLE product (
      id serial PRIMARY KEY,
      code varchar(255) NOT NULL
    )
  `
)
