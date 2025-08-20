import { useContext, useState } from "react"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { categoryContext, CategoryNode } from "@lib/context/category-context"
import { Accordion, AccordionItem } from "@heroui/react"
import { HiMenu, HiX } from "react-icons/hi"

interface NavListSimpleMobileProps {
  className?: string
}

export const NavListSimpleMobile = ({ className }: NavListSimpleMobileProps) => {
  const categoryCtx = useContext(categoryContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (categoryCtx?.isLoading) {
    return (
      <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
    )
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className={clsx("p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200", className)}
        aria-label="Abrir menú de categorías"
      >
        <HiMenu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sliding Menu */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          {
            "translate-x-0": isMenuOpen,
            "-translate-x-full": !isMenuOpen,
          }
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 bg-purple-secondary-gf text-white">
          <h2 className="text-lg font-semibold">Categorías</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-md hover:bg-white/20 transition-colors duration-200"
            aria-label="Cerrar menú"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-2">
          {categoryCtx?.rootCategories && categoryCtx.rootCategories.length > 0 ? (
            <Accordion 
              isCompact 
              selectionMode="multiple" 
              className="px-0"
            >
              {categoryCtx.rootCategories.map((category) => (
                <AccordionItem
                  key={category.id}
                  aria-label={category.name}
                  indicator={category.children && category.children.length > 0 ? undefined : <></>}
                  title={
                    <div className="flex items-center gap-2 py-1">
                      {category.image_url && (
                        <div className="relative w-6 h-6 rounded-sm overflow-hidden flex-shrink-0">
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            fill
                            sizes="24px"
                            style={{ objectFit: 'cover' }}
                            className="rounded-sm"
                          />
                        </div>
                      )}
                      <Link
                        href={`/category/${category.handle}`}
                        className="text-gray-800 font-medium hover:text-purple-600 transition-colors duration-200 flex-1 text-sm"
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    </div>
                  }
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {category.children && category.children.length > 0 && (
                    <div className="space-y-1 pb-1">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/category/${child.handle}`}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200 group"
                          onClick={closeMenu}
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
                          <span className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 text-sm">
                            {child.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay categorías disponibles</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NavListSimpleMobile