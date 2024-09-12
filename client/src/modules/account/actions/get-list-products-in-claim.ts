import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function retriverProctsOrderClaim(idOrder: string) {
  try {
    const products = await axios.get(
      `${BACKEND_URL}/store/claim/${idOrder}/order/list-products-in-claim`,
      {
        withCredentials: true,
      }
    )

    return products.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
