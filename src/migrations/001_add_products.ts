import * as Mysql from '@sqlfx/mysql'
import * as T from 'effect/Effect'

export default T.flatMap(
  Mysql.tag,
  sql =>
    sql`
    CREATE TABLE product (
      id serial PRIMARY KEY,
      code varchar(255) NOT NULL
    )
  `
)
