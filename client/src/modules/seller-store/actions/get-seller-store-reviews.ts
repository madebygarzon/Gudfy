import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

export async function getSellerStoreReviews(store_id: string, next?: number) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/store/seller-store-reviews`,
      {
        withCredentials: true,
        params: {
          store_id,
          next,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Eror al obtener la lista de productos:", error)
  }
}
