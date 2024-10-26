import { fetchProductsList } from "@lib/data"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCart } from "medusa-react"
import React, { useState, useMemo, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { productVariant } from "types/global"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import SkeletonProductStore from "@modules/skeletons/components/skeleton-store"

type InfiniteProductsType = {
  params: StoreGetProductsParams
}

const InfiniteProducts = ({ params }: InfiniteProductsType) => {
  const [products, setProducts] = useState<productVariant[]>([])
  useEffect(() => {
    getListProductVariantWithSellers().then((data) => {
      setProducts(data)
    })
  }, [])
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
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])
  // de manera temporal se mostraran todos los productos
  return (
    <div className="flex-1 content-container">
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-4 gap-y-8 flex-1">
        {products.length
          ? products.map((product) => (
              <li key={product.id}> 
                <ProductVariantPreview {...product} />
              </li>
            ))
          : Array.from(Array(5).keys()).map((i) => (
              <li key={i}>
                <SkeletonProductStore />
              </li>
            ))}
      </ul>
      <div
        className="py-16 flex justify-center items-center text-small-regular text-gray-700"
        ref={ref}
      >
      </div>
    </div>
  )
}

export default InfiniteProducts
