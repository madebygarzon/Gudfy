import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."
export async function getStoreReviews(Next: number) {
  try {
    const codes = await axios.get(`${BACKEND_URL}/seller/store/reviews`, {
      withCredentials: true,
      params: {
        next: Next,
      },
    })

    return codes.data
  } catch (error) {
    console.error("Error al obtener las reviews de la tienda:", error)
    throw error
  }
}
