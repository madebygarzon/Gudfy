import axios from "axios"
import { BACKEND_URL } from "."

export const updateStatusClaim = async (idClaim: string, status: string) => {
  try {
    await axios
      .post(
        `${BACKEND_URL}/store/claim/update-status`,
        { idClaim, status },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((e) => {
        return
      })
  } catch (error: any) {
    console.log("error en la actualizacion del reclamo", error.message)
  }
}
