import axios from "axios"
import { BACKEND_URL } from ".."

export const postFinishTheVariation = async (
  store_variant_order_id: string
) => {
  try {
    const claim = await axios.post(
      `${BACKEND_URL}/store/order/finish-variation`,
      { store_variant_order_id },
      {
        withCredentials: true,
      }
    )
    return
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message)
  }
}
