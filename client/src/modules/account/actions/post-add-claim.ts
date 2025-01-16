import axios from "axios"
import { BACKEND_URL } from "."

type productClaim = {
  store_id: string
  store_name: string
  store_variant_order_id: string
  produc_title: string
  price: string
  quantity: string
  total_price_for_product: string
  comment: string
}

export const addClaim = async (
  idOrder: string,
  claimData: productClaim,
  idCustomer: string,
  image: File | undefined
) => {
  try {
    const formData = new FormData()
    formData.append("idOrder", JSON.stringify(idOrder))
    formData.append("claimData", JSON.stringify(claimData))
    formData.append("idCustomer", JSON.stringify(idCustomer))
    if (image) formData.append("image", image)

    const claim = await axios.post(`${BACKEND_URL}/store/claim/`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    })
    return
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message)
  }
}
