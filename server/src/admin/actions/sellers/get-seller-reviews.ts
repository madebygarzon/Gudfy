import axios from "axios";
import { BACKEND } from "../index";

async function getSellersReviewsList(seller_id) {
  const getlist = await axios.get(`${BACKEND}/admin/sellers-reviews-list`, {
    withCredentials: true,
    params: {
      store_id: seller_id,
    },
  });
  return getlist.data;
}

export default getSellersReviewsList;
