import axios from "axios"
import { ProductCategory } from "@medusajs/medusa"
import {
  objetOptionVariant,
  variant,
} from "../components/dashboard-gf/seller-products/create-product"
type data = {
  product: {
    title: string
    subtitle: string
    description: string
    mid_code: string
  }
  categories: ProductCategory[] | undefined
  optionVariant: objetOptionVariant[]
  variant: variant[]
}

export const CreateProductInput = async (
  productData: data,
  fileImage: FormData
) => {
  try {
    const formData = new FormData()
    formData.append("productData", JSON.stringify(productData))
    formData.append("image", fileImage.get("image") as Blob)
    const product = await axios.post(
      "http://localhost:9000/seller/store/create-product/",
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
