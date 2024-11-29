import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."
export async function getDataReviews() {
  try {
    const codes = await axios.get(`${BACKEND_URL}/seller/store/data-reviews`, {
      withCredentials: true,
    })

    return codes.data
  } catch (error) {
    console.error("Error al obtener las reviews de la tienda:", error)
    throw error
  }
}
