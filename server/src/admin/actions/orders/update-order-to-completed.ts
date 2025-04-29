import axios from "axios";
import { BACKEND } from "../index";

export const updateOrderToCompleted = async (order_id) => {
  try {
    const updateOrder = await axios.post(
      `${BACKEND}/admin/orders/update-order-to-completed`,
      { order_id },
      { withCredentials: true }
    );
    
    return updateOrder.data;
    
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    throw error;
  }
};
