import axios from "axios";
import { BACKEND } from "../index";

export const updateSellerReview = async ({ review_id, payload }) => {
  try {
    const getlist = await axios.post(
      `${BACKEND}/admin/update/seller-review`,
      { review_id, payload },
      { withCredentials: true }
    );
    return getlist;
  } catch (error) {
    console.log("error en la accion de actualizar review", error);
  }
};
