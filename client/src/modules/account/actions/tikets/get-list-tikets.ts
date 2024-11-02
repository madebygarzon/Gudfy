import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "../"
export async function getListTickets() {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/store/account/list-tickets`,
      {
        withCredentials: true,
      }
    )

    return orders.data
  } catch (error) {
    console.error("Error al obtener la lista de tickets:", error)
    throw error
  }
}
