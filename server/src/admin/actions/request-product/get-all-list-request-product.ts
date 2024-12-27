import axios from "axios";
import { BACKEND } from "../index";

export const getAllListRequestProduct = async () => {
  try {
    const getList = await axios.get(
      `${BACKEND}/admin/all-list-request-product`,
      {
        withCredentials: true,
      }
    );
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
