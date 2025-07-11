import axios from "axios";
import { BACKEND } from "../index";

export const getNotification = async () => {
  try {
    const getList = await axios.get(`${BACKEND}/admin/notification/dashboard-admin`, {
      withCredentials: true,
    });
    
    return getList.data.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
