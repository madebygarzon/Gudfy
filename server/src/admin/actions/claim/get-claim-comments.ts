import axios, { AxiosResponse } from "axios";
import { BACKEND } from "..";
export async function getClaimComments(idOrderClaim?: string) {
  try {
    const comments = await axios.get(
      `${BACKEND}/admin/claim/${idOrderClaim}/comment`,
      {
        withCredentials: true,
      }
    );
    return comments.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}
