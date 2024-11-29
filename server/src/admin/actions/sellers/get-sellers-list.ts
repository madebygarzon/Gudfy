import axios from "axios";
import { BACKEND } from "../index";

async function SellersList() {
  const getlist = await axios.get(`${BACKEND}/admin/sellers-list`, {
    withCredentials: true,
  });
  return getlist.data;
}

export default SellersList;
