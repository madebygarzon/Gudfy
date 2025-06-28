import axios from "axios"
import { BACKEND } from "../index"

export const putCommissionGroup = async (
  id: string,
  name: string,
  rate: number
) => {
  const res = await axios.put(
    `${BACKEND}/admin/commission/groups/${id}`,
    { name, rate },
    { withCredentials: true }
  )
  return res.data
}
