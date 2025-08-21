import axios from "axios"
import { BACKEND_URL } from ".."

type data = {
  store_x_variant_id: string
  stock_notificate: number
  activate: boolean
}

export const activateLowStock = async (
  productId: string,
  stock_notificate: number,
  activate: boolean
) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/seller/store/activate-low-stock/`,
      {store_x_variant_id: productId, stock_notificate: stock_notificate, activate: activate},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return product.data
  } catch (error: any) {
    console.error("error en la activacion del stock del producto", error.message)
  
  }
}
