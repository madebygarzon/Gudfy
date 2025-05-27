import axios from "axios";
import { BACKEND } from "../index";

export const updateOrderToPendingToCompleted = async (order_id: string) => {
  try {
    const updateOrder = await axios.post(
      `${BACKEND}/admin/orders/update-order-pending-to-completed`,
      { order_id },
      { withCredentials: true }
    );
    
    return updateOrder.data;
    
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    throw error;
  }
};
