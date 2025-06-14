import axios from "axios";
import { BACKEND } from "../index";

export const updateRequestProduct = async (request_id, product) => {
  try {
    const getlist = await axios.post(
      `${BACKEND}/admin/update-request-product`,
      { request_id, product },
      { withCredentials: true }
    );
    return;
  } catch (error) {}
};
