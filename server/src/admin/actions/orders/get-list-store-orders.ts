import axios from "axios";
import { BACKEND } from "../index";

export const getListStoreOrder = async (idStore) => {
  try {
    const getList = await axios.get(`${BACKEND}/admin/orders/list-orders`, {
      withCredentials: true,
    });
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
