import axios from "axios"
import { BACKEND_URL } from "."

export const updateFinishedOrder = async (orderId: string) => {
  try {
    await axios
      .post(`${BACKEND_URL}/store/order/${orderId}/finished-order`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((e) => {
        return
      })
  } catch (error: any) {
    console.log("error en la cancelacion de la orden", error.message)
  }
}
