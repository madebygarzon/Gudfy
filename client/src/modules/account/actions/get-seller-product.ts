import axios, { AxiosResponse } from "axios"

export async function getSellerProduct() {
  try {
    const products = await axios.get(
      "http://localhost:9000/seller/store/store-products-variants",
      {
        withCredentials: true,
      }
    )

    return products.data
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    throw error
  }
}
