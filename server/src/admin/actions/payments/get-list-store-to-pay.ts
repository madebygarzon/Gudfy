import axios from "axios";
import { BACKEND } from "../index";

export const getListStoresToPay = async () => {
  try {
    console.log("entra en la funsion");
    const getComment = await axios.get(
      `${BACKEND}/admin/wallet/payments/list-store`,
      {
        withCredentials: true,
      }
    );

    return getComment.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
