import { useEffect, useState } from "react"
import { medusaClient } from "@lib/config"
import useDebounce from "@lib/hooks/use-debounce"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
// Custom hook to search product variants by term
// Accepts a search term and returns matching variants and loading state
const useVariantSearch = (term: string) => {
  const [results, setResults] = useState<PricedVariant[]>([])
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
        const { variants } = await medusaClient.product.variants.list({
          q: debouncedTerm,
          limit: 5,
          expand: "product",
        })

        if (!cancel) {
          setResults(variants)
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

export default useVariantSearch
