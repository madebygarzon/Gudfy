import axios from "axios"
import { BACKEND_URL } from "."

type data = {
  product_store_variant_id: string
  customer_id: string
  customer_name: string
  display_name: string
  content: string
  rating: number
}

export const AddProductsReview = async (
  productData: data,
  product_id: string
) => {
  try {
    const product = await axios.post(
      `${BACKEND_URL}store/products/${product_id}/reviews/`,
      productData,
      {
        withCredentials: true,
      }
    )

    return product
  } catch (error: any) {
    console.log("error al agregar el comentario", error.message)
  }
}
