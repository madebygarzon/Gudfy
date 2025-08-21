import axios from "axios";
import { BACKEND } from "../index";

export const getListProductCategory = async () => {
  try {
    const response = await axios.get(
      `${BACKEND}/admin/product-category/list-product-category`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de categorias:", error);
    throw error;
  }
};


