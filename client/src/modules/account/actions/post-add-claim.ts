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
  idCustomer: string
) => {
  try {
    const claim = await axios.post(
      `${BACKEND_URL}/store/claim/`,
      { idOrder, claimData, idCustomer },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message)
  }
}
