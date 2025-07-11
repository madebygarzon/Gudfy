import axios from "axios";
import { BACKEND } from "../index";

export const updateProductCommission = async (
  productId: string,
  commissionId: string | null
): Promise<any> => {
  try {

    const response = await axios.post(
      `${BACKEND}/admin/products/${productId}/commission`,
      {
        commission_id: commissionId,
      },
      { withCredentials: true }
    )
    
    return response.data
  } catch (error) {
    console.error("Error al actualizar la comisión del producto:", error)
    throw error
  }
}
