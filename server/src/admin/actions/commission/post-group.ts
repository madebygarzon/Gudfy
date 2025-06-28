import axios from "axios"
import { BACKEND } from "../index"

export const postCommissionGroup = async (name: string, rate: number) => {
  const res = await axios.post(
    `${BACKEND}/admin/commission/groups`,
    { name, rate },
    { withCredentials: true }
  )
  return res.data
}
