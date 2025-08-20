import { useContext, useState } from "react"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { categoryContext, CategoryNode } from "@lib/context/category-context"

interface NavListSimpleProps {
  className?: string
}

export const NavListSimple = ({ className }: NavListSimpleProps) => {
  const categoryCtx = useContext(categoryContext)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  if (categoryCtx?.isLoading) {
    return (
      <div className="flex space-x-2 p-5 justify-center bg-lila-gf">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-md animate-pulse w-24"></div>
        ))}
      </div>
    )
  }

  return (
    <nav className={clsx("bg-purple-secondary-gf w-full", className)}>
      <div className="flex items-center justify-center space-x-0">
        {categoryCtx?.rootCategories.map((category) => (
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
                <div className="relative w-7 h-7 rounded-sm overflow-hidden">
                  <Image 
                    src={category.image_url} 
                    alt={category.name}
                    fill
                    sizes="28px"
                    style={{ objectFit: 'cover' }}
                    className="rounded-sm"
                  />
                </div>
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
                      href={`/category/${child.handle}`}
                      className="flex items-center gap-2 p-3  text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setHoveredCategory(null)}
                    >
                      {child.image_url && (
                        <div className="relative w-4 h-4 rounded-sm overflow-hidden flex-shrink-0">
                          <Image 
                            src={child.image_url} 
                            alt={child.name}
                            fill
                            sizes="16px"
                            style={{ objectFit: 'cover' }}
                            className="rounded-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parentElement = target.parentElement
                              if (parentElement) {
                                parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-purple-800 rounded-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" class="text-white">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                  </svg>
                                </div>`
                              }
                            }}
                          />
                        </div>
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