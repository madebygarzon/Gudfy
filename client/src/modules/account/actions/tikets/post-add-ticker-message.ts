import axios from "axios"
import { BACKEND_URL } from ".."

type ticketData = {
  ticketId: string
  message: string
}

export const addTicketMessage = async (
  ticketData: ticketData,
  image: File | undefined
) => {
  try {
    const formData = new FormData()
    formData.append("ticketData", JSON.stringify(ticketData))
    if (image) formData.append("image", image)
    const claim = await axios.post(
      `${BACKEND_URL}/store/account/add-ticket-message`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message)
  }
}
