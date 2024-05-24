import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListProductVariant() {
  try {
    const products = await axios.get(
      `${BACKEND_URL}/store/list-products-variant/`,
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
