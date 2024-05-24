import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

export async function getSellerProduct() {
  try {
    const products = await axios.get(
      `${BACKEND_URL}/seller/store/store-products-variants`,
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
