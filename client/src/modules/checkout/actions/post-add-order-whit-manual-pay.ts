import axios from "axios"
import { orderDataForm } from "@lib/context/order-context"

export const handlerUpdateDataLastOrderWithManualPay = async (dataForm: FormData, orderId?: string) => {
    if (!orderId) {
      return alert("No se encontró una orden disponible, por favor cree otra orden")
    }
    
    // Append the order ID to the FormData object
    dataForm.append("store_order_id", JSON.stringify(orderId))
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/order/update-data-with-manual-pay/`,
      dataForm,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    
    return response.data
  }