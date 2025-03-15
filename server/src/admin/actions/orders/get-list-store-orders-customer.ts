import axios from "axios";
import { BACKEND } from "../index";

export const getMetricsListStoreOrderCustomer = async () => {
  try {
    const getList = await axios.get(
      `${BACKEND}/admin/list-metrics-orders-customer`,
      {
        withCredentials: true,
      }
    );
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de ordenes pagadas", error);
  }
};
