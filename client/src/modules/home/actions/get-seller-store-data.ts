import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

export async function getSellerStoreData(handle: string) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/store/seller-store/${handle}`
    )

    return response.data
  } catch (error) {
    console.error("Eror al obtener la tienda individual:", error)
    throw error
  }
}
