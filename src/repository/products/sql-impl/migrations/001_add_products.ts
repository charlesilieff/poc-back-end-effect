/* eslint-disable import/no-default-export */
import { tag } from '@sqlfx/mysql'
import { flatMap } from 'effect/Effect'

export default flatMap(
  tag,
  sql =>
    sql`
    CREATE TABLE products (
      id serial PRIMARY KEY,
      code varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      description varchar(255) NOT NULL,
      price int NOT NULL,
      quantity int NOT NULL,
      inventoryStatus varchar(255) NOT NULL,
      category varchar(255) NOT NULL,
      image varchar(255) NOT NULL,
      rating int NOT NULL
    )
  `
)
