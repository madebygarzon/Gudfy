import axios, { AxiosResponse } from "axios";
import { BACKEND } from "..";
export async function getListClaim() {
  try {
    const orders = await axios.get(`${BACKEND}/admin/list-claim-orders/`, {
      withCredentials: true,
    });
    return orders.data;
  } catch (error) {
    console.error("Error al obtener los reclamos:", error);
    throw error;
  }
}
