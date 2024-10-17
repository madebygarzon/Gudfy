import axios from "axios"
import { BACKEND_URL } from "."

export const updateStateNotification = async (
  notification_id: string,
  status: boolean
) => {
  try {
    await axios
      .post(
        `${BACKEND_URL}/store/notification/${notification_id}/update/${status}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((e) => {
        return
      })
  } catch (error: any) {
    console.log("error en la cancelacion de la orden", error.message)
  }
}
