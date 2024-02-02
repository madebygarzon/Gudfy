import axios from "axios"
type data = {
  title: string
  subtitle: string
  description: string
  mid_code: string
  material: string
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
