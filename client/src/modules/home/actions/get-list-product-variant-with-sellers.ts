import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

export async function getListProductVariantWithSellers() {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/store/list-products-variant-with-sellers/`
    )

    return response.data
  } catch (error) {
    console.error(
      "Eror al obtener la lista de productos con vendedores:",
      error
    )
    throw error
  }
}
