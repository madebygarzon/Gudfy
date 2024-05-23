import axios, { AxiosResponse } from "axios"

export async function getListProductVariant() {
  try {
    const products = await axios.get(
      "http://localhost:9000/store/list-products-variant",
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
