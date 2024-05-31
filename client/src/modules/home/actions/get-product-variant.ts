import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

export async function getProductVariant(handle: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/store/products-variant/`, {
      params: {
        handle,
      },
    })

    return response.data
  } catch (error) {
    console.error("Eror al obtener la lista de productos:", error)
    throw error
  }
}
