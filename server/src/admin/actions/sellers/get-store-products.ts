import axios from "axios";
import { BACKEND } from "../index";

export interface StoreProductsResponse {
  summary: {
    store_id: string;
    store_name: string;
    total_variants: number;
    total_inventory: number;
    total_reserved: number;
    total_available: number;
  } | null;
  details: Array<{
    product: string;
    variant: string;
    inventory: number;
    reserved: number;
    available: number;
  }>;
}

export async function getStoreProducts(storeId: string) {
  const { data } = await axios.get<StoreProductsResponse>(
    `${BACKEND}/admin/stores/${storeId}/products`,
    { withCredentials: true }
  );
  return data;
}

