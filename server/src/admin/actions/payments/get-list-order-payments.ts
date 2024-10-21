import axios from "axios";
import { BACKEND } from "../index";

export const getListOrderPayments = async (idStore) => {
  try {
    const getList = await axios.get(
      `${BACKEND}/admin/payments/${idStore}/list-payments-order`,
      {
        withCredentials: true,
      }
    );
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
