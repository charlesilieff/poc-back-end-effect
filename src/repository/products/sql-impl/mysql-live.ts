import * as Mysql from '@sqlfx/mysql'
import { fromDisk, makeLayer } from '@sqlfx/mysql/Migrator'
import { ConfigSecret } from 'effect'
import * as Config from 'effect/Config'

const USER = 'user'

const PASSWORD = 'password'

export const MysqlLive = Mysql.makeLayer({
  database: Config.succeed('products'),
  host: Config.succeed('localhost'),
  port: Config.succeed(3307),
  username: Config.succeed(USER),
  password: Config.succeed(ConfigSecret.fromString(PASSWORD))
})

export const MigrationLayer = makeLayer({
  loader: fromDisk(
    `./dist/repository/products/sql-impl/migrations`
  )
  // // Where to put the `_schema.sql` file
  // schemaDirectory: 'src/migrations'
})
