import React, { useEffect, useState } from "react";

import type { order } from "../../widgets/orders/index";
import { formatDate } from "../../utils/format-date";
import { Customer } from "@medusajs/medusa";

import clsx from "clsx";
import { formatPrice } from "../../handlers/format-price";

interface ModalOrderProps {
  orderData?: order;
  customer: string;
}
type propsStoreReviwe = {
  store_name: string;
  store_id: string;
  store_order_id: string;
  rating: number;
  customer_name: string;
  customer_id: string;
  content: string;
};

const OrderDetail = ({ orderData, customer }: ModalOrderProps) => {
  // para las ordenes que ya estan finalizadas
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {}, [loading]);

  const handlerState = (state_id: string) => {
    let state = "algo";
    switch (state_id) {
      case "Finished_ID":
        state = "Finalizado";
        break;

      case "Paid_ID":
        state = "Finalizado";
        break;

      case "Completed_ID":
        state = "Completado";
        break;

      case "Discussion_ID":
        state = "En reclamo";
        break;

      default:
        break;
    }
    return state;
  };

  const getColorState = (state_id: string) => {
    switch (state_id) {
      case "Finished_ID":
        return "text-green-500";

      case "Paid_ID":
        return "text-green-500";

      case "Completed_ID":
        return "text-blue-500";

      case "Discussion_ID":
        return "text-orange-500";

      default:
        break;
    }
  };

  return (
    <>
      {orderData ? (
        <div className="w-full md:container  mx-auto p-0 large:p-4">
          <h2 className="text-center text-2xl my-4 font-bold text-gray-700 ">
            Detalles del pedido
          </h2>

          <div className="overflow-y-scroll max-h-[350px] ">
            <table className="min-w-full rounded-lg shadow-2xl p-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b border-slate-200">
                    Producto
                  </th>
                  <th className="py-2 px-4 border-b border-slate-200">Total</th>
                </tr>
              </thead>
              <tbody className="md:text-base text-xs">
                {orderData.store_variant.map((p, i) => (
                  <>
                    <tr className="border-b border-slate-200 ">
                      <td className="md:py-2 md:px-4  border-r border-slate-200 flex justify-between min-w-[250px]">
                        <div className="w-full flex">
                          <div className="w-[60%] md:text-base text-xs">
                            <p>{`${p.produc_title} – ${p.price} USD x ${p.quantity}`}</p>{" "}
                          </div>
                          <div className="w-[40%] md:text-xs text-[10px]  text-center">
                            <p className="leading-tight ">
                              Vendido por:{p.store_name}
                            </p>
                            <span
                              className={`${getColorState(
                                p.variant_order_status_id
                              )}`}
                            >
                              {handlerState(p.variant_order_status_id)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b border-slate-200 md:text-base text-xs">
                        ${formatPrice(parseFloat(p.total_price_for_product))}{" "}
                        USD
                      </td>
                    </tr>
                  </>
                ))}
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200  md:text-base text-xs">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 border-r border-slate-200  md:text-base text-xs">
                    $
                    {orderData.store_variant.reduce((sum, p) => {
                      return sum + parseFloat(p.total_price_for_product);
                    }, 0)}{" "}
                    USD
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200  ">
                    Comisión de la pasarela de pago:
                  </td>
                  <td className="py-2 px-4 border-r border-slate-200 ">
                    $0.23
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200 ">
                    Método de pago:
                  </td>
                  <td className="py-2 px-4 border-r border-slate-200 ">
                    Binance Pay Entrega Automática
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200 ">
                    Total:
                  </td>
                  <td className="py-2 px-4 border-r border-slate-200 ">
                    $
                    {orderData.store_variant.reduce((sum, p) => {
                      return sum + parseFloat(p.total_price_for_product);
                    }, 0.23)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-[10px] md:text-base">
            <p className="text-base">
              El pedido{" "}
              <span className="font-bold text-blue-gf">
                #{orderData.id.replace("store_order_id_", "")}
              </span>{" "}
              se realizó el{" "}
              <span className="font-bold text-blue-gf">
                {formatDate(orderData.created_at)}
              </span>
              .
            </p>
            <p className="font-bold  text-blue-gf  ">
              {`Orden por: ${customer} correo: ${orderData.email}`}{" "}
            </p>
            <h2 className="  my-4 text-warning-600 ">
              * A partir de la recepción de tu pedido, dispones de un plazo de 3
              días hábiles para presentar cualquier reclamo relacionado con tu
              compra. Si no recibimos ninguna notificación dentro de este
              período, consideraremos que has recibido el producto en óptimas
              condiciones y procederemos a marcar tu orden como Finalizada.*
            </h2>
          </div>
          <div className="w-full"></div>
        </div>
      ) : (
        <>CARGANDO...</>
      )}
    </>
  );
};

export default OrderDetail;
