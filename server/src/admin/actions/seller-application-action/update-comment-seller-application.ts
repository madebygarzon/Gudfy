import axios from "axios";
import { BACKEND } from "../index";

export const updateCommentSellerApplication = async (
  customer_id,
  comment_status
) => {
  try {
    const getlist = await axios.post(
      `${BACKEND}/admin/commentsellerapplication`,
      { customer_id, comment_status },
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {}
};
