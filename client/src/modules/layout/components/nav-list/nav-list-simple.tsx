import { useEffect, useState } from "react"
import { getListCategories } from "../../actions/get-list-categories"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import Link from "next/link"

interface NavListSimpleProps {
  className?: string
}

type CategoryNode = Omit<ProductCategory, 'children'> & {
  children?: CategoryNode[]
  beforeInsert?: never 
  image_url?: string 
  created_at: string | Date
  updated_at: string | Date
}

export const NavListSimple = ({ className }: NavListSimpleProps) => {
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getListCategories()
        
        const sortedData = [...data].sort((a, b) => {
          if (a.rank !== undefined && b.rank !== undefined) {
            return a.rank - b.rank
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        
          const categoryMap = new Map<string, CategoryNode>()
        const rootCategories: CategoryNode[] = []
        
        sortedData.forEach((category: ProductCategory) => {
          const { beforeInsert, ...categoryData } = category as any
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
            rootCategories.push(category)
          }
        })
        
        setCategories(rootCategories)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex space-x-2 p-5 justify-center bg-lila-gf">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-md animate-pulse w-24"></div>
        ))}
      </div>
    )
  }

  return (
    <nav className={clsx("bg-lila-gf w-full", className)}>
      <div className="flex items-center justify-center space-x-0">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="relative group"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => {
              const timeoutId = setTimeout(() => {
                if (hoveredCategory === category.id) {
                  setHoveredCategory(null);
                }
              }, 200);
              return () => clearTimeout(timeoutId);
            }}
          >
            <Link
              href={`/category/${category.handle}`}
              className={clsx(
                "p-3 rounded-[5px] transition-colors duration-200 inline-flex items-center gap-3",
                "text-sm font-medium text-gray-200 hover:bg-gray-100/20 uppercase tracking-wide",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lila-gf/50"
              )}
            >
              {category.image_url && (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-7 h-7 object-cover rounded-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              )}
              <span>{category.name}</span>
             
            </Link>

            {category.children && category.children.length > 0 && hoveredCategory === category.id && (
              <div 
                className="absolute left-0 mt-0 w-48 rounded-b-md bg-white shadow-2xl z-50 border border-gray-100"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  transform: 'translateY(0.25rem)',
                  marginTop: '-0.25rem',
                  paddingTop: '0.25rem',
                }}
              >
                <div className="py-1">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/categories/${child.handle}`}
                      className="flex items-center gap-2 p-3  text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setHoveredCategory(null)}
                    >
                      {child.image_url && (
                        <img 
                          src={child.image_url} 
                          alt={child.name}
                          className="w-4 h-4 object-cover rounded-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )}
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default NavListSimple