import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."
export async function getListProductSerials(store_variant_id: string) {
  try {
    const codes = await axios.get(
      `${BACKEND_URL}/seller/store/get-list-product-serials/${store_variant_id}`,
      {
        withCredentials: true,
      }
    )

    return codes.data
  } catch (error) {
    console.error("Error al obtener la orden actual:", error)
    throw error
  }
}
