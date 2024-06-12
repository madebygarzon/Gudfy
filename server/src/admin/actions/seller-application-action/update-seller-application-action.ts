import axios from "axios";
import dotenv from "dotenv";
//import { BACKEND } from "../index";

dotenv.config({ path: '.env.production' });
const BACKEND = process.env.BACKEND_URL || "http://localhost:9000";

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
  } catch (error) {
    console.error("Error in updateSellerApplicationAction:", error);
    throw error;
  }
};
