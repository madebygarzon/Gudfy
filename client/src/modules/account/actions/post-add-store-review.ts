import axios from "axios"
import { BACKEND_URL } from "."

type data = {
  store_id?: string
  store_order_id?: string
  rating?: number
  customer_name?: string
  customer_id?: string
  content?: string
}

export const AddStoreReview = async (reviewData: data) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}/store/reviews/store-order`,
      { ...reviewData },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )

    return product
  } catch (error: any) {
    console.log("error al agregar el comentario", error.message)
  }
}
