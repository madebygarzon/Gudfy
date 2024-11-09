import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."
export async function getListSerialCode() {
  try {
    const codes = await axios.get(
      `${BACKEND_URL}/store/account/list-serial-codes`,
      {
        withCredentials: true,
      }
    )

    return codes.data.serialCodes
  } catch (error) {
    console.error("Error al obtener la orden actual:", error)
    throw error
  }
}
