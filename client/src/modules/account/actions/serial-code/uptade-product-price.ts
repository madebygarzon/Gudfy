import axios from "axios"
import { BACKEND_URL } from ".."

type data = {
  productvariantid: string
  price: number
}

export const postUpdatePriceProduct = async (productData: data) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/seller/store/update-product-price`,
      productData,
      {
        withCredentials: true,
      }
    )
    return product
  } catch (error: any) {
    console.log(error)
  }
}
