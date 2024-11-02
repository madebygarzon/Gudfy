import axios from "axios"
import { BACKEND_URL } from ".."

type ticketData = {
  subject: string
  message: string
}

export const addTicket = async (
  ticketData: ticketData,
  image: File | undefined,
  customer_id: string | undefined
) => {
  try {
    const formData = new FormData()
    formData.append(
      "ticketData",
      JSON.stringify({ ...ticketData, customer_id })
    )
    if (image) formData.append("image", image)
    const claim = await axios.post(
      `${BACKEND_URL}/store/account/add-ticket`,
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
