import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getCurrentOrder(customerId: string) {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/store/account/${customerId}/current-order`,
      {
        withCredentials: true,
      }
    )

    return orders.data
  } catch (error) {
    console.error("Error al obtener la orden actual:", error)
    throw error
  }
}
