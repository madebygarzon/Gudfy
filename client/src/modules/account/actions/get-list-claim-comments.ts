import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListClaimComments(idOrderClaim?: string) {
  try {
    const comments = await axios.get(
      `${BACKEND_URL}/store/claim/${idOrderClaim}/comment`,
      {
        withCredentials: true,
      }
    )

    return comments.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
