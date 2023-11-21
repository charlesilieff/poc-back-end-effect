
import { createServer } from "node:http";

import * as Http from "@effect/platform-node/HttpServer";
import { runMain } from "@effect/platform-node/Runtime";
import { Effect, Layer } from "effect";


const ServerLive = Http.server.layer(() => createServer(), { port: 3000 });

const serve = Http.router.empty.pipe(
  Http.router.get("/health-get", Http.response.json({ status: "ok" })),
  Http.router.options("/health-options", Http.response.json({ status: "ok" })),

  Http.server.serve(Http.middleware.logger)
);


const HttpLive = Layer.scopedDiscard(serve).pipe(
  Layer.use(ServerLive),
);

Layer.launch(HttpLive).pipe(Effect.tapErrorCause(Effect.logError), runMain);