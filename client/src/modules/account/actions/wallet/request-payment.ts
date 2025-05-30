import axios from "axios"
import { BACKEND_URL } from ".."


export const requestPayment = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/seller/store/request-payment/`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return response.data
  } catch (error: any) {
    console.log("error en la solicitud del request payment", error.message)
  }
}
