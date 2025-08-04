"use client"

import { StoreGetProductsParams, Product, ProductCategory } from "@medusajs/medusa"
import { fetchProductsListTab } from "@modules/products/actions"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import { useMemo } from "react"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Thumbnail from "../thumbnail"
import { BiCategory } from "react-icons/bi"
import clsx from "clsx"

// Definir el tipo para los productos devueltos por la API
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
}

const CategoryProducts = ({ categoryId, categoryName, categoryDescription }: CategoryProductsProps) => {
  const router = useRouter()
  const { cart } = useCart()

  // Configuración de parámetros de consulta
  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    p.is_giftcard = false
    
    // Filtramos por la categoría proporcionada
    if (categoryId) {
      p.category_id = [categoryId]
    }

    return p
  }, [cart?.id, categoryId])

  // Consulta para obtener los productos de la categoría
  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery(
    [`category-products-${categoryId}`, queryParams],
    () => fetchProductsListTab({ pageParam: 0, queryParams }),
    { 
      enabled: !!categoryId // Solo ejecutar si hay un categoryId
    }
  )

 

  const products = data?.response.products || []



  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="flex-1 w-full">
        {/* Banner de categoría en estado de carga */}
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 mb-6 rounded-lg animate-pulse">
          <div className="h-32 flex items-center justify-center">
            <div className="w-48 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Productos en estado de carga */}
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

  // Renderizar estado de error
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

  // Renderizar estado vacío
  if (products.length === 0) {
    return (
      <div className="w-full">
        {/* Banner de categoría */}
        <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 mb-6 rounded-lg overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <BiCategory size={40} className="text-white mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{categoryName || 'Categoría'}</h1>
            <p className="text-gray-200 max-w-2xl">{categoryDescription || 'Explora nuestra selección de productos'}</p>
          </div>
        </div>
        
        <div className="text-white text-center py-10 bg-gray-800/30 rounded-lg">
          <BiCategory size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No hay productos disponibles</h3>
          <p className="text-gray-300">No se encontraron productos en esta categoría.</p>
        </div>
      </div>
    )
  }

  // Renderizar productos
  return (
    <div className="w-full">
      {/* Banner de categoría */}
      <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 mb-6 rounded-lg overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <BiCategory size={40} className="text-white mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{categoryName || 'Categoría'}</h1>
          <p className="text-gray-200 max-w-2xl">{categoryDescription || 'Explora nuestra selección de productos'}</p>
        </div>
      </div>
      
      {/* Controles de paginación y productos */}
      <div className="flex flex-col w-full">
        {/* Encabezado de productos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">
            Productos <span className="text-sm font-normal">({data?.response.count || 0} encontrados)</span>
          </h2>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product: ProductPreviewType) => (
              <div key={product.id} className="group relative">
                
                <Link href={`/product/${product.title.replaceAll(" ", "-").toLowerCase()}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-all duration-300 h-full">
                    {/* Imagen del producto */}
                    <div className="aspect-square relative overflow-hidden">
                      <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                        <Thumbnail 
                          thumbnail={product.thumbnail} 
                          size="full"
                        />
                      </div>
                      
                      {/* Aquí iría la etiqueta de oferta si el producto tiene descuento */}
                    </div>
                    
                    {/* Información del producto */}
                    <div className="p-4">
                      <h3 className="text-white text-sm font-medium line-clamp-2 mb-2 h-10">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        {product.price && (
                          <div className="flex flex-col">
                            {/* Aquí iría el precio anterior si el producto tiene descuento */}
                            
                            {/* Precio actual */}
                            <span className="text-white font-bold">
                              ${(product.price / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                        
                        {/* Aquí iría la calificación real del producto */}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
          ))}
        </div>
        

      </div>
    </div>
  )
}

export default CategoryProducts
