import axios from "axios";
import { BACKEND } from "..";

export const updateTicketStatus = async (
  ticket_id: string,
  status: "Closed_ID" | "Answered_ID"
) => {
  try {
    const claim = await axios.post(
      `${BACKEND}/admin/ticket/update-ticket-status`,
      { ticket_id, status },
      {
        withCredentials: true,
      }
    );
    return;
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message);
  }
};

