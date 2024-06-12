import axios from "axios";
import dotenv from "dotenv";
//import { BACKEND } from "../index";

dotenv.config({ path: '.env.production' });
const BACKEND = process.env.BACKEND_URL || "http://localhost:9000";

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
