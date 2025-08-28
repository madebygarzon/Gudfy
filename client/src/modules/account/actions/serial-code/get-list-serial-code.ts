import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from ".."

type SerialCodeParams = {
  page?: number
  limit?: number
  search?: string
}

export async function getListSerialCode(params: SerialCodeParams = {}) {
  try {
    const { page, limit, search } = params;
    let url = `${BACKEND_URL}/store/account/list-serial-codes`;
    
    const queryParams = [];
    if (page !== undefined) queryParams.push(`page=${page}`);
    if (limit !== undefined) queryParams.push(`limit=${limit}`);
    if (search !== undefined && search.trim() !== '') queryParams.push(`search=${encodeURIComponent(search.trim())}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    
    const response = await axios.get(url, {
      withCredentials: true,
    });
    const serialCodes = Array.isArray(response.data.serialCodes) 
      ? response.data.serialCodes 
      : Array.isArray(response.data.data) 
        ? response.data.data 
        : [];
        
    return {
      serialCodes: serialCodes,
      totalCount: response.data.totalCount || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 10,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    console.error("Error al obtener códigos seriales:", error);
    throw error;
  }
}
