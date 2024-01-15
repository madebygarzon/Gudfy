import axios from "axios"
type data = {
  title: string
}

export const CreateProductInput = async (data: data) => {
  try {
    const product = await axios.post(
      "http://localhost:9000/seller/store/create-product/",
      data,
      { withCredentials: true }
    )

    return product.data
  } catch (error: any) {
    console.log("error en la creacion del producto", error.message)
  }
}
