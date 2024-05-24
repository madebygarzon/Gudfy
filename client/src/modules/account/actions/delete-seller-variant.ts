import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."
export default function DeleteVariant(idVariant: string) {
  const params = { idV: idVariant }
  try {
    return axios.delete(`${BACKEND_URL}/seller/store/variant/`, {
      params,
    })
  } catch (error) {}
}
