"use client"

import { ProductCategory } from "@medusajs/medusa"
import React, { createContext, useState, useEffect } from "react"
import { getListCategories } from "@modules/layout/actions/get-list-categories"

export type CategoryNode = Omit<ProductCategory, 'children'> & {
  children?: CategoryNode[]
  beforeInsert?: never 
  image_url?: string 
  created_at: string | Date
  updated_at: string | Date
  rank?: number
}

interface CategoryContext {
  product_categories: CategoryNode[] | undefined
  isLoading: boolean
  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
  childCategory: () => CategoryNode[] | undefined
  rootCategories: CategoryNode[]
}
interface CategoryProviderProps {
  children?: React.ReactNode
}

export const categoryContext = createContext<CategoryContext | null>(null)

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [isSelect, setIsSelect] = useState<string>(
    "pcat_01HYXTEJNKS2VYMFXZ76B0MDND"
  )
  const [product_categories, setProductCategories] = useState<CategoryNode[]>([])
  const [rootCategories, setRootCategories] = useState<CategoryNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data = await getListCategories()
        
        const sortedData = [...data].sort((a, b) => {
          if (a.rank !== undefined && b.rank !== undefined) {
            return a.rank - b.rank
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        
        const categoryMap = new Map<string, CategoryNode>()
        const roots: CategoryNode[] = []
        
        sortedData.forEach((category: any) => {
          const { beforeInsert, ...categoryData } = category
          categoryMap.set(category.id, { 
            ...categoryData, 
            children: [] 
          })
        })
        
        categoryMap.forEach((category) => {
          if (category.parent_category_id && categoryMap.has(category.parent_category_id)) {
            const parent = categoryMap.get(category.parent_category_id)!
            if (!parent.children) parent.children = []
            parent.children.push(category)
            parent.children.sort((a, b) => {
              if (a.rank !== undefined && b.rank !== undefined) {
                return a.rank - b.rank
              }
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            })
          } else {
            roots.push(category)
          }
        })
        
        const allCategories = Array.from(categoryMap.values())
        
        setProductCategories(allCategories)
        setRootCategories(roots)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  const childCategory = () => {
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
        childCategory: childCategory,
        rootCategories
      }}
    >
      {children}
    </categoryContext.Provider>
  )
}
