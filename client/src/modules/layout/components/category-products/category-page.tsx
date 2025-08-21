"use client"
import { Suspense, useContext } from "react"
import { categoryContext } from "@lib/context/category-context"
import CategoryProducts from "@modules/products/components/category-products"

type Props = {
    params:{category: string }
  }

const categoryProducts = (params: Props) => {
  const categoryHandle = params.params.category
  const categoryCtx = useContext(categoryContext)
  
  const category = categoryCtx?.product_categories?.find(
    (cat) => cat.handle === categoryHandle
  )
  
  if (!category && !categoryCtx?.isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Categoría no encontrada</h1>
        <p className="text-gray-300">La categoría que estás buscando no existe o ha sido eliminada.</p>
      </div>
    )
  }
  
  if (categoryCtx?.isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg h-64 w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 mb-6 rounded-lg">
            <div className="h-32 flex items-center justify-center">
              <div className="w-48 h-6 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg h-64 w-full"></div>
            ))}
          </div>
        </div>
      }>
        <CategoryProducts 
          categoryId={category?.id || ''} 
          categoryName={category?.name} 
          categoryDescription={category?.description}
          categoryImage={category?.image_url}
        />
      </Suspense>
    </div>
  )
}

export default categoryProducts
