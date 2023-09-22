"use client"
import { fetchProductsList } from "@lib/data"
import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import { StoreGetProductsParams } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useCart } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useCollections } from "medusa-react"
import { useRouter } from "next/navigation"

type InfiniteProductsType = {
  params: StoreGetProductsParams
}

const Recommendedproduct = ({ params }: InfiniteProductsType) => {
  const router = useRouter()
  const { collections } = useCollections()
  const collectionIds = params.collection_id || []
  const handlerSteam = () => {
    collections?.filter((c) => {
      if (c.id === collectionIds[0]) {
        return router.push(`/collections/${c.handle}`)
      }
      return router.push("/store")
    })
  }

  const { cart } = useCart()

  const { ref, inView } = useInView()

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    p.is_giftcard = false

    return {
      ...p,
      ...params,
    }
  }, [cart?.id, params])

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      [`infinite-products-store`, queryParams, cart],
      ({ pageParam }) => fetchProductsList({ pageParam, queryParams }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )

  const previews = usePreviews({ pages: data?.pages, region: cart?.region })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  return (
    <div className="flex-1 content-container">
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-x-4 gap-y-8 flex-1">
        {previews.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
        {isLoading &&
          !previews.length &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
        {!isLoading && !previews.length && (
          <div>
            <div className="bg-red-200 text-red-800 p-4 rounded-md shadow-md">
              <div className="font-bold text-lg mb-2">Error:</div>
              <p className="mb-2">No se encontraron productos</p>
              <div className="font-bold text-lg mb-2">Posible solución:</div>
              <p>
                Consulte con el personal de administracion o Recarge la pagina
                con ctrl+W o consulte con su programador{" "}
              </p>
            </div>
          </div>
        )}
      </ul>
      {previews.length >= 6 ? (
        <div className="flex w-full justify-center py-10">
          <button
            type="button"
            onClick={handlerSteam}
            className="border-blue-gf text-blue-gf border-solid  border-[1px] w-[150px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2"
          >
            Ver más
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Recommendedproduct
