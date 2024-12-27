import axios from "axios";
import { BACKEND } from "../index";

export const updateRequestProduct = async (request_id) => {
  try {
    const getlist = await axios.post(
      `${BACKEND}/admin/update-request-product`,
      { request_id },
      { withCredentials: true }
    );
    return;
  } catch (error) {}
};
