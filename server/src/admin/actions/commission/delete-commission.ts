import axios from "axios"
import { BACKEND } from "../index"

export const deleteCommission = async (id: string) => {
  const res = await axios.delete(`${BACKEND}/admin/commission/${id}`, {
    withCredentials: true,
  })
  return res.data
}
