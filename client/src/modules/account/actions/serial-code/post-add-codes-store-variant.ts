import axios from "axios"
import { BACKEND_URL } from ".."
type CodesResult = {
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}
type data = {
  productvariantid: string
  codes: string[] | undefined
}

export const postAddCodesProduct = async (productData: data) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/seller/store/add-codes-store-variant`,
      productData,
      {
        withCredentials: true,
      }
    )
    return
  } catch (error: any) {
    console.log(error.message)
  }
}
