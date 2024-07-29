import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListOrders(customerId: string) {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/store/account/${customerId}/orders`,
      {
        withCredentials: true,
      }
    )

    return orders.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
