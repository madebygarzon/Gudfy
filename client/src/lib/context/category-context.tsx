"use client"

import { ProductCategory } from "@medusajs/medusa"
import { useProductCategories } from "medusa-react"
import React, { createContext, useState } from "react"

interface CategoryContext {
  product_categories: ProductCategory[] | undefined
  isLoading: boolean
  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
  categoriesChildren: () => void
}
interface CategoryProviderProps {
  children?: React.ReactNode
}

export const categoryContext = createContext<CategoryContext | null>(null)

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [isSelect, setIsSelect] = useState<string>(
    "pcat_01HEWWNY7F9MCCY1F957FPM5HG"
  )
  const { product_categories, isLoading } = useProductCategories()

  function categoryChildren() {
    const filter = product_categories?.filter(
      (category) => category.parent_category_id === isSelect
    )
    return filter
  }
  return (
    <categoryContext.Provider
      value={{
        product_categories,
        isLoading,
        selectedCategory: isSelect,
        setSelectedCategory: setIsSelect,
        categoriesChildren: categoryChildren,
      }}
    >
      {children}
    </categoryContext.Provider>
  )
}
