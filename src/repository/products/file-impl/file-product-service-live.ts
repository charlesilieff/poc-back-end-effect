import * as FileSystem from '@effect/platform-node/FileSystem'
import * as Sc from '@effect/schema/Schema'
import {
  Effect as T,
  HashMap as HM,
  Layer as L,
  Option as O,
  Order,
  pipe,
  ReadonlyArray as A
} from 'effect'
import type { Brand } from 'effect/Brand'

import { Product, ProductId } from '../../../models/Product.js'
import { ProductNotFoundError } from '../../../services/products/errors/ProductNotFoundError.js'
import { ProductRepositoryService } from '../products.js'

export const makeProductFileSystemRepoLive = L.effect(
  ProductRepositoryService,
  T.gen(function* (_) {
    const fs = yield* _(FileSystem.FileSystem)
    const PATH = './src/repository/products/file-impl/products.json'

    const readProductsHashMap = T.gen(function* (_) {
      const productsString = yield* _(fs.readFileString(PATH))

      const products = yield* _(
        productsString,
        Sc.parse(Sc.ParseJson),
        T.flatMap(Sc.parse(Sc.array(Product))),
        T.tapError(T.logError)
      )

      return pipe(
        products,
        A.map(product =>
          product.id !== undefined ? O.some([product.id, product] as const) : O.none()
        ),
        A.compact,
        HM.fromIterable
      )
    })

    const writeProductsHashMap = (
      products: HM.HashMap<number & Brand<'ProductId'> | undefined, Product>
    ) => fs.writeFileString(PATH, pipe(products, HM.values, A.fromIterable, JSON.stringify))

    const getOneProductRepo: ProductRepositoryService['getOneProductRepo'] = id =>
      pipe(
        readProductsHashMap,
        T.flatMap(HM.get(id)),
        T.mapError(_ => ProductNotFoundError.of('Product not found'))
      )

    const getProductsRepo: ProductRepositoryService['getProductsRepo'] = () =>
      pipe(readProductsHashMap, T.map(HM.values), T.map(A.fromIterable))

    const patchOneProductRepo: ProductRepositoryService['patchOneProductRepo'] = product =>
      T.gen(function* (_) {
        if (product.id === undefined) {
          return yield* _(ProductNotFoundError.of('Product id is undefined'))
        }
        const newProducts = yield* _(
          pipe(readProductsHashMap, T.map(HM.modify(product.id, _ => product)))
        )

        yield* _(writeProductsHashMap(newProducts))
        return product.id
      })

    const postProductsRepo: ProductRepositoryService['postProductsRepo'] = product =>
      T.gen(function* (_) {
        const products = yield* _(readProductsHashMap)

        // FIXME: this is not optimal
        const newId = pipe(
          products,
          HM.values,
          A.fromIterable,
          A.map(p => O.fromNullable(p.id)),
          A.compact,
          A.sort(Order.number),
          A.last,
          O.match({ onNone: () => 0, onSome: id => id + 1 }),
          Sc.parseSync(ProductId)
        )

        const newProducts = yield* _(
          pipe(readProductsHashMap, T.map(HM.set(newId, { ...product, id: newId } as Product)))
        )
        yield* _(writeProductsHashMap(newProducts))

        return newId
      })

    const removeOneProductRepo: ProductRepositoryService['removeOneProductRepo'] = productId =>
      pipe(
        readProductsHashMap,
        T.map(HM.remove(productId)),
        T.flatMap(writeProductsHashMap),
        T.zipRight(T.succeed(productId))
      )

    return ProductRepositoryService.of({
      getOneProductRepo,
      getProductsRepo,
      patchOneProductRepo,
      postProductsRepo,
      removeOneProductRepo
    })
  }).pipe(T.provide(FileSystem.layer))
)
