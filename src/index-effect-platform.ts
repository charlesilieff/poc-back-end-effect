import { createServer } from 'node:http'

import * as Http from '@effect/platform-node/HttpServer'
import { runMain } from '@effect/platform-node/Runtime'
import * as Headers from '@effect/platform/Http/Headers'
import * as Middleware from '@effect/platform/Http/Middleware'
import { ServerRequest } from '@effect/platform/Http/ServerRequest'
import { Effect, Layer } from 'effect'

const cors = Middleware.make(app =>
  Effect.gen(function* (_) {
    const request = yield* _(ServerRequest)

    const response = yield* _(app)
    console.log('request.method ', request.method)
    if (request.method === 'OPTIONS') {
      console.log('request.method ', request.method)
      return response
    }

    return yield* _(app)
  })
)

export const xForwardedHeaders = Middleware.make(httpApp =>
  Effect.updateService(
    httpApp,
    ServerRequest,
    request =>
      request.method === 'OPTIONS' ?
        request.modify({
          headers: Headers.set(
            request.headers,
            'host',
            request.headers['x-forwarded-host']
          ),
          remoteAddress: request.headers['x-forwarded-for']?.split(',')[0].trim()
        }) :
        request
  )
)

const ServerLive = Http.server.layer(() => createServer(), { port: 3000 })

const serve = Http.router.empty.pipe(
  Http.router.get('/health-get', Http.response.json({ status: 'ok' })),
  Http.router.options('/health-options', Http.response.json({ status: 'ok' })),
  x => x,
  Http.server.serve(cors),
  x => x
)

const HttpLive = Layer.scopedDiscard(serve).pipe(
  Layer.use(ServerLive)
)

Layer.launch(HttpLive).pipe(Effect.tapErrorCause(Effect.logError), runMain)
