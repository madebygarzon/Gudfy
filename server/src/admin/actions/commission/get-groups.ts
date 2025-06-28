import axios from "axios"
import { BACKEND } from "../index"

export const getCommissionGroups = async () => {
  const res = await axios.get(`${BACKEND}/admin/commission/groups`, {
    withCredentials: true,
  })
  return res.data
}
