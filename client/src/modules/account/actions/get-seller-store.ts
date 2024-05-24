import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export async function getStore() {
  try {
    const store = await axios.get(`${BACKEND_URL}/seller/store/`, {
      withCredentials: true,
    })
    return store.data
  } catch (error) {
    console.error("Error al obtener la tienda:", error)
    throw error
  }
}
