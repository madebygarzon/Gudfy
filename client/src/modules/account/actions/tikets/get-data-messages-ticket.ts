import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "../"
export async function getDataMessagesTicket(ticket: string) {
  try {
    const orders = await axios.get(
      `${BACKEND_URL}/store/account/${ticket}/messages-ticket`,
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
