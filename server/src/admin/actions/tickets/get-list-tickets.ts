import axios from "axios";
import { BACKEND } from "../index";

export const getListTickets = async () => {
  try {
    const getList = await axios.get(`${BACKEND}/admin/tickets/list-tickets`, {
      withCredentials: true,
    });

    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de tickets", error);
  }
};
