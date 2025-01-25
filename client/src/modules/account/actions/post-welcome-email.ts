import axios from "axios"
import { BACKEND_URL } from "."

type data = {
  email: string
  name: string
}

export const WelcomeEmail = async (emailData: data) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/store/account/welcome-email`,
      { ...emailData },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )

    return product
  } catch (error: any) {
    console.log("error al enviar el email de bienbenida", error.message)
  }
}
