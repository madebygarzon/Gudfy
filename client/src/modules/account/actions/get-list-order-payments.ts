import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListOrderPayments(idStore: string) {
  try {
    const ordersPayments = await axios.get(
      `${BACKEND_URL}/seller/store/${idStore}/orders/payments`,
      {
        withCredentials: true,
      }
    )

    return ordersPayments.data
  } catch (error) {
    console.error("Error al obtener las pagos de las ordenes:", error)
    throw error
  }
}
