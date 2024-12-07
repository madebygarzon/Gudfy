import axios from "axios"
import { ProductCategory } from "@medusajs/medusa"

import { BACKEND_URL } from ".."

export const updateStoreName = async (productData: string) => {
  try {
    const editStore = await axios.post(
      `${BACKEND_URL}/seller/store/edit-name-store/`,
      { name: productData },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return
  } catch (error: any) {
    console.log(
      "error en la actualización del nombre de la tienda",
      error.message
    )
  }
}
