import axios from "axios"
import { BACKEND } from "../index"

export const getCommission = async () => {
  const res = await axios.get(`${BACKEND}/admin/commission`, {
    withCredentials: true,
  })
  return res.data
}
