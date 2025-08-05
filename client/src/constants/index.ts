export const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "9000"
export const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  `http://localhost:${BACKEND_PORT}`
