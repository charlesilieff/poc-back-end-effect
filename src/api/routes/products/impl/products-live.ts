import * as Middleware from "@effect/platform/Http/Middleware";
import { ServerRequest } from '@effect/platform/Http/ServerRequest';
import * as ServerResponse from "@effect/platform/Http/ServerResponse";
import * as Sc from '@effect/schema/Schema';
import { Effect as T, pipe } from 'effect';
import { RouterBuilder, ServerError } from 'effect-http';

import type { Product } from '../../../../models/Product.js';
import { ProductId } from '../../../../models/Product.js';
import { ProductService } from '../../../../services/products/products-service.js';
import { ProductsRoutes } from '../products.js';

export const ProductRoutes = T.gen(function* (_) {
  const productService = yield* _(ProductService)

  const getProductsHandler = () =>
    T.map(productService.getProducts(), products => ({ data: products }))

  const postProductsHandler = ({ body }: { body: Product }) =>
    T.map(productService.createProduct(body), productId => ({ data: productId }))

  const getOneProductHandler = ({ params }: { params: { id: string } }) =>
    pipe(
      Sc.parse(ProductId)(+params.id),
      T.mapError(parseError => ServerError.badRequest(parseError.errors)),
      T.flatMap(productId =>
        productService.getOneProduct(productId).pipe(
          T.mapError(e => ServerError.notFoundError(`Product not found : ${e.toStringError()}`))
        )
      )
    )



  const patchOneProductHandler = ({ body }: { body: Product }) =>
    productService.updateOneProduct(body)

  const removeOneProductHandler = ({ params }: { params: { id: string } }) =>
    pipe(
      Sc.parse(ProductId)(+params.id),
      T.mapError(parseError => ServerError.badRequest(parseError.errors)),
      T.flatMap(productId =>
        productService.removeOneProduct(productId).pipe(
          T.mapError(e => ServerError.notFoundError(`Product not found : ${e.toStringError()}`))
        )
      )
    )

  const cors = Middleware.make(app =>
    T.gen(function* (_) {
      const request = yield* _(ServerRequest);


      console.log(request.method)

      // @ts-expect-error typo on options method: it should be "OPTIONS" not "options" 
      if (request.method === "options") {


        // eslint-disable-next-line @typescript-eslint/naming-convention
        return ServerResponse.empty({ status: 204, headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PATCH, DELETE', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Origin': 'http://localhost:4200' } });
      }


      // eslint-disable-next-line @typescript-eslint/naming-convention
      return yield* _(app, T.flatMap(ServerResponse.setHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })))
    }))

  return pipe(
    ProductsRoutes,
    RouterBuilder.make,
    RouterBuilder.handle('getProducts', getProductsHandler),
    RouterBuilder.handle('postProducts', postProductsHandler),
    RouterBuilder.handle('getOneProduct', getOneProductHandler),
    RouterBuilder.handle('patchOneProduct', patchOneProductHandler),
    RouterBuilder.handle('removeOneProduct', removeOneProductHandler),

    // Check if all routes are implemented
    RouterBuilder.build, cors

  )
})
