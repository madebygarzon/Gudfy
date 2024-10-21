import axios from "axios";
import { BACKEND } from "../index";

export const postDataOrderPay = async (dataPay, voucher, products) => {
  try {
    const formData = new FormData();
    formData.append("addOrderPay", JSON.stringify(dataPay));
    formData.append("products", JSON.stringify(products));
    formData.append("voucher", voucher);
    const getlist = await axios.post(
      `${BACKEND}/admin/wallet/payments/order-pay`,
      formData,
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {}
};
