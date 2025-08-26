import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

type FilterParams = {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  collection_id?: string[];
}

export async function getListProductVariantWithSellers(filters?: FilterParams) {
  try {
 
    let url = `${BACKEND_URL}/store/list-products-variant-with-sellers/`;
    
    if (filters) {
      const params = new URLSearchParams();
      
      if (filters.category_id) {
        params.append('category_id', filters.category_id);
      }
      
      if (filters.min_price !== undefined) {
        params.append('min_price', filters.min_price.toString());
      }
      
      if (filters.max_price !== undefined) {
        params.append('max_price', filters.max_price.toString());
      }
      
      if (filters.search) {
        params.append('q', filters.search);
      }
      
      if (filters.collection_id && filters.collection_id.length > 0) {
        filters.collection_id.forEach(id => {
          params.append('collection_id', id);
        });
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener la lista de productos con vendedores:",
      error
    )
    throw error
  }
}
