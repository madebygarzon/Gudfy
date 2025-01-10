import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."

export default async function DeleteSerialCode(
  idVariant: string[] | string
): Promise<AxiosResponse<any>> {
  const params = { idSC: idVariant }
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/seller/store/delelte-serial-codes`,
      { params }
    )
    return response
  } catch (error) {
    console.error("Error al eliminar seriales:", error)
    throw error
  }
}
