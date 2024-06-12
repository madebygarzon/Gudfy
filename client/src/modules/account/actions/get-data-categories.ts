import Medusa from "@medusajs/medusa-js"
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });
export default async function getAllCategories() {
  const medusa = new Medusa({
    baseUrl:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    maxRetries: 3,
  })
  return await medusa.productCategories.list()
}
