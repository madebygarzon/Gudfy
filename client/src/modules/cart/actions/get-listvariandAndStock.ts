import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
import { LineItem } from "@medusajs/medusa"

interface lineItem
  extends Omit<
    LineItem,
    "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
  > {
  store_variant_id: string
  store: { store_name: string; customer_email: string }
}

export async function getListVariantAndStock(items: lineItem[]) {
  try {
    const products = await axios.get(
      `${BACKEND_URL}/store/cart/variant-stock`,
      {
        params: { items },
        withCredentials: true,
      }
    )

    return products.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
