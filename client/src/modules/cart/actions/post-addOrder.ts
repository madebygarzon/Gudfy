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

export async function postAddOrder(items: lineItem[], customer_id: string) {
  try {
    const products = await axios.post(
      `${BACKEND_URL}/store/cart/add-order`,
      { items, customer_id },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return products.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
