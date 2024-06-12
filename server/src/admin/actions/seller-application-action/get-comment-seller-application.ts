import axios from "axios";
//import { BACKEND } from "../index";
const BACKEND = process.env.BACKEND_URL || "http://localhost:9000";

export const getCommenSellerApplication = async (customer_id: string) => {
  try {
    const getComment = await axios.get(
      `${BACKEND}/admin/commentsellerapplication`,
      { params: { customer_id } }
    );

    return getComment.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
