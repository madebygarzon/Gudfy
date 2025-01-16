import axios from "axios"
import { BACKEND_URL } from "."

type dataComment = {
  comment?: string
  order_claim_id?: string
  customer_id?: string
  comment_owner_id?: string
}

export const postAddComment = async (
  dataComment: dataComment,
  image: File | undefined
) => {
  try {
    const formData = new FormData()
    formData.append("dataComment", JSON.stringify(dataComment))
    if (image) formData.append("image", image)
    const claim = await axios.post(
      `${BACKEND_URL}/store/claim/customer/add-comment`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message)
  }
}
