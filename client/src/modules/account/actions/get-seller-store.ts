import axios, { AxiosResponse } from "axios"

export async function getStore() {
  try {
    const store = await axios.get("http://localhost:9000/seller/store/", {
      withCredentials: true,
    })
    return store.data
  } catch (error) {
    console.error("Error al obtener la tienda:", error)
    throw error
  }
}
