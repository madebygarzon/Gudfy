import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

// Defaults to standard port for Medusa server
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "9000"
const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  `http://localhost:${BACKEND_PORT}`

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
})

const medusaClient = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

export { MEDUSA_BACKEND_URL, queryClient, medusaClient }
