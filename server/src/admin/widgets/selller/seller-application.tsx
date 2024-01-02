import type { WidgetConfig } from "@medusajs/admin";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
const SellerApplication = () => {
  const handlerGetListApplication = () => {
    console.log("click");
    getListSellerApplication();
  };
  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <h1>Seller Application</h1>
      <button
        className="bg-slate-200 px-2 py-1"
        onClick={() => handlerGetListApplication()}
      >
        {" "}
        listado prueba
      </button>
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "customer.list.after",
};

export default SellerApplication;
