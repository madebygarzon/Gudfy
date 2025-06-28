import axios from "axios"
import { BACKEND } from "../index"

export const deleteCommissionGroup = async (id: string) => {
  const res = await axios.delete(`${BACKEND}/admin/commission/groups/${id}`, {
    withCredentials: true,
  })
  return res.data
}
