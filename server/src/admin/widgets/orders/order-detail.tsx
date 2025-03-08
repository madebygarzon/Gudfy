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
        <div className="w-full md:container  mx-auto p-2 large:p-4">
          <div className="my-2  text-base ">
            <p className="text-lg">
              El pedido
              <span className=" ">#{orderData.id}</span>
              se realizó el
              <span className="font-bold ">
                {formatDate(orderData.created_at)}
              </span>
              .
            </p>
            <p className="font-bold   ">{`Orden por: ${customer} `} </p>
            <p>Correo: {orderData.email}</p>
          </div>
          <div className="overflow-y-scroll min-h-[350px] ">
            <table className="min-w-full rounded-lg shadow-2xl p-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b border-slate-100">
                    Productos
                  </th>
                  <th className="py-2 px-4 border-b border-slate-100">Total</th>
                </tr>
              </thead>
              <tbody className="lg:text-base text-xs">
                {orderData.store_variant.map((p, i) => (
                  <>
                    <tr className="border-b border-slate-200 ">
                      <td className="py-2 px-4  border-r border-slate-200 flex justify-between min-w-[250px]">
                        <div className="w-full flex justify-between">
                          <div className="text-base">
                            <p className="font-bold">{`${p.produc_title} – ${p.price} USD x ${p.quantity}`}</p>

                            <p className=" font-light ">
                              Tienda:{p.store_name}
                            </p>
                          </div>
                          <div className=" w-[20%] text-base  text-center">
                            <span
                              className={`${getColorState(
                                p.variant_order_status_id
                              )} `}
                            >
                              {handlerState(p.variant_order_status_id)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b border-slate-200 text-base ">
                        ${formatPrice(parseFloat(p.total_price_for_product))}{" "}
                        USD
                      </td>
                    </tr>
                  </>
                ))}
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200  small:text-base text-xs">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 border-r border-slate-200  large:text-base text-xs ">
                    $
                    {formatPrice(
                      orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product);
                      }, 0)
                    )}
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
                    {formatPrice(
                      orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product);
                      }, 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>CARGANDO...</>
      )}
    </>
  );
};

export default OrderDetail;
