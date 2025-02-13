"use client"
import { fetchProductsListTab } from "@modules/products/actions"
import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import { StoreGetProductsParams } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useCart } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useCollections } from "medusa-react"
import { useRouter } from "next/navigation"
import ButtonLigth from "@modules/common/components/button_light"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"
import Link from "next/link"
import Thumbnail from "../thumbnail"

type InfiniteProductsType = {
  params: StoreGetProductsParams
}

const Recommendedproduct = ({ params }: InfiniteProductsType) => {
  const router = useRouter()
  const { collections } = useCollections()
  const collectionIds = params.collection_id || []
  const [page, setPage] = useState(0)

  const handlerSteam = () => {
    // opcion ver más para cada categoria seleccionada
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

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(
      [`paginate-products-store`, page, queryParams],
      () => fetchProductsListTab({ pageParam: page, queryParams }),
      { keepPreviousData: true }
    )

  const previews = data?.response.products || []

  useEffect(() => {
    setPage(0)
  }, [params])

  return (
    <div className="flex items-center px-10 w-full">
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        className="-mr-2 px-2 tex"
        disabled={page === 0}
      >
        <IoIosArrowBack size={30} color={`${page !== 0 ? "white" : "grey"}`} />
      </button>

      <div className="flex-1">
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-x-2 gap-y-8 flex-1">
          {previews.length
            ? previews.map(
                (p: {
                  id: string
                  parent_title: string
                  title: string
                  thumbnail: string
                }) => (
                  <li key={p.id} className="text-white">
                    <Link
                      href={`/products/${p.parent_title}/${p.title
                        ?.replace(" ", "_")
                        .toLowerCase()}`}
                    >
                      <div>
                        <Thumbnail thumbnail={p.thumbnail} size="full" />
                        <div className="flex justify-center">
                          <div className=" text-base-regular text-center mt-2 z-10 w-[90%] ">
                            <span>{p.title}</span>
                            <div className="flex w-full items-center"></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              )
            : ""}
          {isLoading &&
            !previews.length &&
            repeat(6).map((index) => (
              <li key={index}>
                <SkeletonProductPreview />
              </li>
            ))}
        </ul>

        {!isLoading && !previews.length && (
          <div className="flex justify-center h-[250px]  items-center w-full">
            <h2 className="text-3xl text-white text-center w-[70%]">
              {" "}
              ¡Oh, vaya! , Lamentablemente en la actualidad no contamos con
              productos disponibles en esta categoría.
            </h2>
            {/* <div className="bg-red-200 text-red-800 p-4 rounded-md shadow-md">
              <div className="font-bold text-lg mb-2">Error:</div>
              <p className="mb-2">No se encontraron productos</p>
              <div className="font-bold text-lg mb-2">Posible solución:</div>
              <p>
                ¡Oh, vaya! Estamos enfrentando problemas técnicos en este
                momento. Te invitamos a intentarlo nuevamente.{" "}
              </p>
            </div> */}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (!isPreviousData && data?.nextPage) {
            setPage((old) => old + 1)
          }
        }}
        disabled={isPreviousData || !data?.nextPage}
        className="cursor-pointer -ml-2 px-2"
      >
        <IoIosArrowForward
          size={30}
          color={`${isPreviousData || !data?.nextPage ? "grey" : "white"}`}
        />
      </button>
    </div>
  )
}

export default Recommendedproduct
