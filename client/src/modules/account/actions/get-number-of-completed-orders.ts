import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function numberOfCompletedOrders(customer_id: string) {
  try {
    const reviwe = await axios.get(
      `${BACKEND_URL}/store/account/number-completed-orders/${customer_id}`,
      {
        withCredentials: true,
      }
    )
    return reviwe.data.number
  } catch (error) {
    console.error("Error recuperar wallet", error)
    throw error
  }
}
