"use client"

import { StoreGetProductsParams, Product } from "@medusajs/medusa"
import { fetchProductsListTab } from "@modules/products/actions"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import { useMemo } from "react"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Thumbnail from "../thumbnail"
import { BiCategory } from "react-icons/bi"
import clsx from "clsx"
import Image from "next/image"
import { CategoryNode } from "@lib/context/category-context"

type ProductPreviewType = {
  id: string
  title: string
  thumbnail: string | null
  price?: number
  handle?: string
}

type CategoryProductsProps = {
  categoryId: string
  categoryName?: string
  categoryDescription?: string
  categoryImage?: string
}

const CategoryProducts = ({ categoryId, categoryName, categoryDescription, categoryImage }: CategoryProductsProps) => {
  const router = useRouter()
  const { cart } = useCart()

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    p.is_giftcard = false
    
    if (categoryId) {
      p.category_id = [categoryId]
    }

    return p
  }, [cart?.id, categoryId])

  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery(
    [`category-products-${categoryId}`, queryParams],
    () => fetchProductsListTab({ pageParam: 0, queryParams }),
    { 
      enabled: !!categoryId
    }
  )

 

  const products = data?.response.products || []



  if (isLoading) {
    return (
      <div className="flex-1 w-full">
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 mb-6 rounded-lg animate-pulse">
          <div className="h-32 flex items-center justify-center">
            <div className="w-48 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <SkeletonProductPreview />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-white text-center py-10 w-full">
        <div className="bg-red-900/30 p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">Error al cargar los productos</h3>
          <p>Ha ocurrido un problema al cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="w-full">
        
        <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 mb-6 rounded-lg overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative">
              {categoryImage ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={categoryImage}
                    alt={categoryName || 'Categoría'}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                   
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-800 rounded-lg">
                  <BiCategory size={40} className="text-white" />
                </div>
              )}
            </div>
            
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{categoryName || 'Categoría'}</h1>
              <p className="text-gray-200 max-w-2xl">{categoryDescription || 'Explora nuestra selección de productos'}</p>
            </div>
          </div>
        </div>
        
        <div className="text-white text-center py-10 bg-gray-800/30 rounded-lg">
          {categoryImage ? (
            <img 
              src={categoryImage} 
              alt={categoryName || 'Categoría'}
              className="w-12 h-12 object-cover rounded-md mx-auto mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" class="text-gray-400 mx-auto"><path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/><path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/></svg>';
                target.parentNode?.appendChild(fallbackDiv.firstChild!);
              }
            }
            />
          ) : (
            <BiCategory size={48} className="mx-auto mb-4 text-gray-400" />
          )}
          <h3 className="text-xl font-bold mb-2">No hay productos disponibles</h3>
          <p className="text-gray-300">No se encontraron productos en esta categoría.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 mb-6 rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative">
            {categoryImage ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={categoryImage}
                  alt={categoryName || 'Categoría'}
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-800 rounded-lg">
                <BiCategory size={40} className="text-white" />
              </div>
            )}
          </div>
          
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{categoryName || 'Categoría'}</h1>
            <p className="text-gray-200 max-w-2xl">{categoryDescription || 'Explora nuestra selección de productos'}</p>
          </div>
        </div>
      </div>
      
      
      <div className="flex flex-col w-full">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">
            Productos <span className="text-sm font-normal">({data?.response.count || 0} encontrados)</span>
          </h2>
        </div>

        
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8">
          {products.map((product: ProductPreviewType) => (
            <li key={product.id}>
              <Link href={`/product/${product.title.replaceAll(" ", "-").toLowerCase()}`}>
                <div>
                  <Thumbnail 
                    thumbnail={product.thumbnail} 
                    size="full"
                  />
                  <div className="flex justify-center">
                    <div className=" text-base-regular text-center mt-2 z-10 w-[90%] ">
                      <div className="flex justify-center pt-1">
                        <Image
                          src="/product/stars.svg"
                          alt="stars_gudfy"
                          width={100}
                          height={50}
                        />
                      </div>
                      <span className="flex font-semibold w-full text-center text-xs items-center justify-center"></span>
                      <span className="font-bold">{product.title}</span>
                      <div className="flex w-full items-center">
                        {product.price && (
                          <span className="font-semibold w-full text-center">
                            Precio: ${(product.price / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        

      </div>
    </div>
  )
}

export default CategoryProducts
