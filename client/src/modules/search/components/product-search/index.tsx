import { useState, useRef, useEffect, KeyboardEvent } from "react"
import useVariantSearch from "@lib/hooks/use-variant-search"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

// Search component displayed in the header.
// Shows a list of matching product variants under the input field.
const ProductSearch = () => {
  const [term, setTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { results } = useVariantSearch(term)
  const router = useRouter()
  const { t } = useTranslation("common")

  // Show dropdown when there is a search term
  useEffect(() => {
    setOpen(term.length > 0)
    setActiveIndex(-1)
  }, [term])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
    }
    if (e.key === "Enter") {
      const variant = results[activeIndex]
      if (variant) {
        router.push(`/products/${variant.product?.handle}`)
        setOpen(false)
        setTerm("")
      }
    }
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("search_placeholder", "Buscar productos...")}
        className="w-full bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none"
      />
      {open && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto z-50">
          {results.length > 0 ? (
            results.map((variant, index) => (
              <li
                key={variant.id}
                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                  index === activeIndex ? "bg-gray-100" : ""
                }`}
              >
                <Link
                  href={`/products/${variant.product?.handle}`}
                  className="flex items-center gap-2 w-full"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <Thumbnail
                      thumbnail={variant.product?.thumbnail}
                      size="bsmall"
                    />
                  </div>
                  <span className="text-sm text-gray-900">
                    {variant.product?.title} - {variant.title}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-2 text-sm text-gray-500">
              {t("no_results", "No hay resultados")}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default ProductSearch
