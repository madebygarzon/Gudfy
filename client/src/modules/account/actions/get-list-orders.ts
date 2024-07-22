import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListOrders() {
  try {
    const orders = await axios.get(`${BACKEND_URL}/store/account/orders`, {
      withCredentials: true,
    })

    return orders.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
