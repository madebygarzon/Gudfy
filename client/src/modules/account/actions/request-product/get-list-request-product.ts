import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."
export async function getListRequestProduct(customerId: string) {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/seller/store/list-request-product/${customerId}`,
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
