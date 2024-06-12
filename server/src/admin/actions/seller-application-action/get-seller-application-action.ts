import axios from "axios";
//import { BACKEND } from "../index";

const BACKEND = process.env.BACKEND_URL || "http://localhost:9000";

axios.defaults.withCredentials = true;
export const getListSellerApplication = async (order: string = "DESC") => {
  try {
    const getlist = await axios.get(`${BACKEND}/admin/sellerapplication`, {
      withCredentials: true,
      params: { order },
    });
    return getlist.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
