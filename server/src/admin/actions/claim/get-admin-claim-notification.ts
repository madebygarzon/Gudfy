import axios, { AxiosResponse } from "axios";
import { BACKEND } from "..";
export async function getClaimNotification() {
  try {
    const notification = await axios.get(
      `${BACKEND}/admin/notification/claim/`,
      {
        withCredentials: true,
      }
    );
    return notification.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}
