import axios, { AxiosResponse } from "axios";
import { BACKEND } from "../";
export async function getDataMessagesTicket(ticket: string) {
  try {
    const tickets = await axios.get(
      `${BACKEND}/admin/tickets/${ticket}/messages-ticket`,
      {
        withCredentials: true,
      }
    );

    return tickets.data;
  } catch (error) {
    console.error("Error al obtener la lista de tickets:", error);
    throw error;
  }
}
