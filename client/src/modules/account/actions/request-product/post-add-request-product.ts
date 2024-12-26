import axios from "axios"
import { BACKEND_URL } from ".."

type data = {
  customer_id: string
  product_title: string
  description: string
  variants: string
}

export const addRequestProduct = async (
  productData: data,
  fileImage: FormData
) => {
  try {
    const formData = new FormData()
    formData.append("productData", JSON.stringify(productData))
    formData.append("image", fileImage.get("image") as Blob)
    const product = await axios.post(
      `${BACKEND_URL}/seller/store/create-request-product/`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return product.data
  } catch (error: any) {
    console.log("error en la creacion del producto", error.message)
  }
}
