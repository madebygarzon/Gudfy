import axios from "axios";
import { BACKEND } from "../index";

export const addImageToCategory = async (categoryId: string, imageFile?: File | null) => {
  try {
    if (imageFile) {
      const formData = new FormData();
      
      formData.append('image', imageFile);
      
      formData.append('id', categoryId);
      
       const response = await axios.post(
        `${BACKEND}/admin/product-category/add-image`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error al agregar imagen a la categoria:", error);
    throw error;
  }
};
