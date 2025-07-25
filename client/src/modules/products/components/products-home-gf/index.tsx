"use client"
import { fetchProductsListTab } from "@modules/products/actions"
import { StoreGetProductsParams } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useCart, useCollections } from "medusa-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Thumbnail from "../thumbnail"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"

type InfiniteProductsType = {
  params: StoreGetProductsParams
}

const Recommendedproduct = ({ params }: InfiniteProductsType) => {
  const { collections } = useCollections()
  const collectionIds = params.collection_id || []
  const [page, setPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { cart } = useCart()

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}
    if (cart?.id) p.cart_id = cart.id
    p.is_giftcard = false
    return { ...p, ...params }
  }, [cart?.id, params])

  const { isLoading, data } = useQuery(
    [`paginate-products-store`, page, queryParams],
    () => fetchProductsListTab({ pageParam: page, queryParams }),
    { keepPreviousData: true }
  )

  const previews = data?.response.products || []

  useEffect(() => {
    setPage(0)
  }, [params])

  /** 👉 NUEVA FUNCIÓN SCROLL */
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex items-center md:px-10 px-2 w-full relative">
      {/* Flecha Izquierda */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full"
      >
        <IoIosArrowBack size={30} color="white" />
      </button>

      {/* Contenedor scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide w-full px-8 scroll-smooth"
      >
        {previews.length
          ? previews.map((p: { id: string; parent_title: string; title: string; thumbnail: string }) => (
              <div key={p.id} className="text-white min-w-[180px] max-w-[180px] flex-shrink-0">
                <Link href={`/products/${p.parent_title}/${p.title?.replace(" ", "_").toLowerCase()}`}>
                  <div>
                    <Thumbnail thumbnail={p.thumbnail} size="full" />
                    <div className="flex justify-center">
                      <div className=" text-base-regular text-center mt-2 w-[90%] ">
                        <span>{p.title}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          : ""}
        {isLoading &&
          !previews.length &&
          Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <SkeletonProductPreview />
            </li>
          ))}
      </div>

      {/* Flecha Derecha */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full"
      >
        <IoIosArrowForward size={30} color="white" />
      </button>
    </div>
  )
}

export default Recommendedproduct
