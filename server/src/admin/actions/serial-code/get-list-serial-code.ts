import axios from "axios";
import { BACKEND } from "../index";

async function getListSerialCode() {
  const getlist = await axios.get(`${BACKEND}/admin/serial-code/list-serial-code`, {
    withCredentials: true,
  });
  return getlist.data;
}

export default getListSerialCode;
