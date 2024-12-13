import axios from "axios"
import { ProductCategory } from "@medusajs/medusa"

import { BACKEND_URL } from ".."

export const updateSellerAvatar = async (productData: string) => {
  try {
    const editStore = await axios.post(
      `${BACKEND_URL}/seller/store/edit-seller-avatar/`,
      { avatar: productData },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return
  } catch (error: any) {
    console.log(
      "error en la actualización del avatar de la tienda",
      error.message
    )
  }
}
