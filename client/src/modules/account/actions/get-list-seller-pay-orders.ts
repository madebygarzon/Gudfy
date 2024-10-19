import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getListPayOrders() {
  try {
    const reviwe = await axios.get(
      `${BACKEND_URL}/seller/store/wallet/orders`,
      {
        withCredentials: true,
      }
    )
    return reviwe.data
  } catch (error) {
    console.error("Error recuperar wallet", error)
    throw error
  }
}
