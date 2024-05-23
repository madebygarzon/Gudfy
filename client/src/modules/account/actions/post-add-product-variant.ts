import axios from "axios"

type data = {
  variantID: string
  price?: number | undefined
  codes: string[]
  amount: number
  duplicates: { [key: string]: number } | number
}[]

export const AddProductsVariant = async (productData: data) => {
  try {
    const product = await axios.post(
      "http://localhost:9000/seller/store/add-product-variant/",
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
