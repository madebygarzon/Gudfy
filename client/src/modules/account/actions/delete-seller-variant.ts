import axios, { AxiosResponse } from "axios"

export default function DeleteVariant(idVariant: string) {
  const params = { idV: idVariant }
  try {
    return axios.delete("http://localhost:9000/seller/store/variant/", {
      params,
    })
  } catch (error) {}
}
