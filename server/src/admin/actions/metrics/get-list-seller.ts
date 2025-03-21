import axios from "axios";
import { BACKEND } from "../index";
import { SimpleConsoleLogger } from "typeorm";

export const getMetricsSeller = async () => {
  try {
    const getList = await axios.get(`${BACKEND}/admin/list-metrics-seller`, {
      withCredentials: true,
    });

    console.log(" estos son los datos", getList);
    return getList.data;
  } catch (error) {
    console.log("error al obtener la lista de metricas del seller", error);
  }
};
