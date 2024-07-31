import axios from "axios"
import { BACKEND_URL } from "."

export const updateCancelStoreOrder = async (orderId: string) => {
  try {
    await axios
      .post(`${BACKEND_URL}/store/order/${orderId}/cancel-order`, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((e) => {
        return
      })
  } catch (error: any) {
    console.log("error en la cancelacion de la orden", error.message)
  }
}
