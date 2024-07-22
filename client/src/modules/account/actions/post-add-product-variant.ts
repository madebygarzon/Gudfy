import axios from "axios"
import { BACKEND_URL } from "."

type data = {
  variantID: string
  price?: number | undefined
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}[]

export const AddProductsVariant = async (productData: data) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/seller/store/add-product-variant/`,
      productData,
      {
        withCredentials: true,
      }
    )
    return
  } catch (error: any) {
    console.log("error al agregar el del producto", error.message)
  }
}
