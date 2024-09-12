import axios from "axios";
import { BACKEND } from "..";
type dataComment = {
  comment?: string;
  order_claim_id?: string;
  customer_id?: string;
  comment_owner_id?: string;
};

export const postAddComment = async (dataComment: dataComment) => {
  try {
    const claim = await axios.post(
      `${BACKEND}/admin/claim/admin/add-comment`,
      dataComment,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return;
  } catch (error: any) {
    console.log("error al agregar el reclamo", error.message);
  }
};
