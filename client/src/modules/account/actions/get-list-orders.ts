import axios, { AxiosResponse } from "axios"
import { BACKEND_URL } from "."

interface GetListOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export async function getListOrders(customerId: string, params?: GetListOrdersParams) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.search && params.search.trim() !== '') queryParams.append('search', params.search.trim());
 
    const queryString = queryParams.toString();
    const url = `${BACKEND_URL}/store/account/${customerId}/orders${queryString ? `?${queryString}` : ''}`;

    
    const response = await axios.get(url, {
      withCredentials: true,
    });

    const result = {
      data: response.data.data || [],
      totalCount: response.data.totalCount || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 10,
      totalPages: response.data.totalPages || 1
    };
    return result;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return {
      data: [],
      totalCount: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    };
  }
}
