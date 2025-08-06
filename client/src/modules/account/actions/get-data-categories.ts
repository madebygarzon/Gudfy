import Medusa from "@medusajs/medusa-js"
export default async function getAllCategories() {
  const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "9000"
  const medusa = new Medusa({
    baseUrl:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      `http://localhost:${BACKEND_PORT}`,
    maxRetries: 3,
  })
  return await medusa.productCategories.list()
}
