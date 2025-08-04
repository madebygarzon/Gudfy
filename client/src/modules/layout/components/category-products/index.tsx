"use client"

import React, { useContext, useEffect, useMemo, useState } from "react"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import { categoryContext } from "@lib/context/category-context"
import { fetchProductsListTab } from "@modules/products/actions"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import Thumbnail from "@modules/products/components/thumbnail"
import repeat from "@lib/util/repeat"
import Link from "next/link"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"

const CategoryProducts: React.FC = () => {
  const categories = useContext(categoryContext)
  const { cart } = useCart()
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [categories?.selectedCategory])

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    p.is_giftcard = false

    if (categories?.selectedCategory) {
      p.category_id = [categories.selectedCategory]
    }

    return p
  }, [cart?.id, categories?.selectedCategory])

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(
      [`category-products`, page, queryParams],
      () => fetchProductsListTab({ pageParam: page, queryParams }),
      { 
        keepPreviousData: true,
        enabled: !!categories?.selectedCategory
      }
    )

  const previews = data?.response.products || []

  const selectedCategoryInfo = categories?.product_categories?.find(
    (cat) => cat.id === categories.selectedCategory
  )
  if (!categories?.selectedCategory) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Selecciona una categoría
            </h2>
            <p className="text-gray-600">
              Elige una categoría arriba para ver los productos disponibles
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategoryInfo?.name || "Productos"}
          </h2>
          {selectedCategoryInfo?.description && (
            <p className="text-gray-600">{selectedCategoryInfo.description}</p>
          )}
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 0}
          >
            <IoIosArrowBack 
              size={24} 
              className={page !== 0 ? "text-[#3F1C7A]" : "text-gray-400"} 
            />
          </button>

          <div className="flex-1">
            {isLoading && !previews.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {repeat(6).map((index) => (
                  <div key={index}>
                    <SkeletonProductPreview />
                  </div>
                ))}
              </div>
            ) : previews.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previews.map((product: {
                  id: string
                  parent_title: string
                  title: string
                  thumbnail: string
                }) => (
                  <div key={product.id} className="group">
                    <Link
                      href={`/product/${product.title.replaceAll(" ", "-").toLowerCase()}`}
                      className="block"
                    >
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="aspect-square overflow-hidden rounded-t-lg group-hover:scale-105 transition-transform duration-200">
                          <Thumbnail 
                            thumbnail={product.thumbnail} 
                            size="full"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {product.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay productos disponibles
                  </h3>
                  <p className="text-gray-600">
                    Lamentablemente no contamos con productos disponibles en esta categoría en este momento.
                  </p>
                </div>
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
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowForward
              size={24}
              className={!isPreviousData && data?.nextPage ? "text-[#3F1C7A]" : "text-gray-400"}
            />
          </button>
        </div>

        {isFetching && previews.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3F1C7A]"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryProducts
