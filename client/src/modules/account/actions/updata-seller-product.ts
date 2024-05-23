import axios from "axios"
import { ProductCategory } from "@medusajs/medusa"
import { variant } from "../components/dashboard-gf/seller-products/request-product"

type editProductData = {
  id: string
  product: {
    title?: string
    subtitle?: string
    description?: string
    mid_code?: string
  }
  deleteCategories?: ProductCategory[]
  addCategories?: ProductCategory[]
  variant?: variant[]
}

export const updateProduct = async (
  productData: editProductData,
  payload: string[],
  fileImage?: FormData
) => {
  try {
    const formData = new FormData()
    formData.append("productData", JSON.stringify(productData))
    formData.append("payload", JSON.stringify(payload))
    if (fileImage) formData.append("image", fileImage.get("image") as Blob)
    const product = await axios.post(
      "http://localhost:9000/seller/store/edit-product/",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return
  } catch (error: any) {
    console.log("error en la actualización del producto", error.message)
  }
}
