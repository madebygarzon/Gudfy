import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getCurrentOrder(store_order_id: string) {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/store/account/${store_order_id}/current-order`,
      {
        withCredentials: true,
      }
    )

    return orders.data[0]
  } catch (error) {
    console.error("Error al obtener la orden actual:", error)
    throw error
  }
}
