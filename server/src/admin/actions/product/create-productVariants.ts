import axios from "axios";
import { BACKEND } from "../index";

/**
 * Crea o actualiza un producto con sus variantes
 * @param product Datos del producto
 * @param imageFile Archivo de imagen opcional (si se ha subido una nueva imagen)
 */
export const createProductVariant = async (product, imageFile?: File | null) => {
  try {
    if (imageFile) {
      const formData = new FormData();
      
      formData.append('image', imageFile);
      
      formData.append('productData', JSON.stringify(product));
      
       const response = await axios.post(
        `${BACKEND}/admin/product/create-product-variant-with-image`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } else {
      const response = await axios.post(
        `${BACKEND}/admin/product/create-product-variant`,
        {product},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear/actualizar producto:", error);
    throw error;
  }
};
