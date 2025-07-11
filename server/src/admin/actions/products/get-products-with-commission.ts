import axios from "axios";
import { BACKEND } from "../index";

export const getProductsWithCommission = async () => {
  try {
    const response = await axios.get(
      `${BACKEND}/admin/product/get-products-with-commission`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
      