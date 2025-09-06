import { useEffect, useState } from "react"
import { medusaClient } from "@lib/config"
import useDebounce from "@lib/hooks/use-debounce"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

// Custom hook to search products by term
// Accepts a search term and returns matching products and loading state
const useProductSearch = (term: string) => {
  const [results, setResults] = useState<PricedProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounce term to avoid excessive requests
  const debouncedTerm = useDebounce(term, 300)

  useEffect(() => {
    let cancel = false

    const search = async () => {
      if (!debouncedTerm) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { products } = await medusaClient.products.list({
          q: debouncedTerm,
          limit: 5,
        })

        if (!cancel) {
          setResults(products)
        }
      } catch (e) {
        if (!cancel) {
          setResults([])
        }
      } finally {
        if (!cancel) {
          setIsLoading(false)
        }
      }
    }

    search()

    return () => {
      cancel = true
    }
  }, [debouncedTerm])

  return { results, isLoading }
}

export default useProductSearch
