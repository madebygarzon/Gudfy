import axios from "axios"
import { BACKEND } from "../index"

export const postCommission= async (name: string, rate: number) => {
  const res = await axios.post(
    `${BACKEND}/admin/commission`,
    { name, rate },
    { withCredentials: true }
  )
  return res.data
}
