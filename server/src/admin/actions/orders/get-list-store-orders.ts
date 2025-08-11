import axios from "axios";
import { BACKEND } from "../index";

export const getListStoreOrder = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  store?: string;
  search?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params?.store) queryParams.append('store', params.store);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${BACKEND}/admin/orders/list-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const getList = await axios.get(url, {
      withCredentials: true,
    });
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
