import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function validateComment(store_order_id: string) {
  try {
    const reviwe = await axios.get(
      `${BACKEND_URL}/store/store-order/${store_order_id}/reviews`,
      {
        withCredentials: true,
      }
    )

    return reviwe.data
  } catch (error) {
    console.error("Error al validar si ya existe el comentario:", error)
    throw error
  }
}
