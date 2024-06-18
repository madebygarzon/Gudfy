import axios from "axios";
import { BACKEND } from "../index";

export const updateSellerAplicationAction = async ({
  payload,
  customer_id,
  comment_status,
}) => {
  try {
    const getlist = await axios.post(
      `${BACKEND}/admin/sellerapplication`,
      { payload, customer_id, comment_status },
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {}
};
