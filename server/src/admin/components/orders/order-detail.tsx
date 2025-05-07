import React, { useEffect, useState } from "react";

import type { order } from "../../widgets/orders/index";
import { formatDate } from "../../utils/format-date";
import { Customer } from "@medusajs/medusa";
import { updateOrderToCompleted } from "../../actions/orders/update-order-to-completed";

import clsx from "clsx";
import { formatPrice } from "../../handlers/format-price";
import { updateOrderToCancel } from "../../actions/orders/update-order-cancel";

interface ModalOrderProps {
  orderData?: order;
  customer: string;
  handlerReset: () => void;
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

const OrderDetail = ({ orderData, customer, handlerReset }: ModalOrderProps) => {
  // para las ordenes que ya estan finalizadas
  const [loading, setLoading] = useState<boolean>(true);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [completingOrder, setCompletingOrder] = useState<boolean>(false);
  const [successOrder, setSuccessOrder] = useState<{cancel: boolean, complete: boolean}>({cancel: false, complete: false});

  useEffect(() => {
  }, [successOrder, loading]);

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

  const handlerUpdateOrder = async () => {
    try {
      setCompletingOrder(true);
      const result = await updateOrderToCompleted(orderData.id);
      setOrderResult(result);
      if (result.success) {
        setSuccessOrder(prev => ({ ...prev, complete: true }));
      }
    } catch (error) {
      console.error("Error al completar la orden:", error);
      setOrderResult({
        success: false,
        message: "Error al procesar la solicitud",
      });
    } finally {
      setCompletingOrder(false);
    }
  };
  const handlerUpdateCancelOrder = async () => {
    try {
      setCompletingOrder(true);
      const result = await updateOrderToCancel(orderData.id);
      const processedResult = result || { success: false, message: "No se recibió respuesta del servidor" };
      setOrderResult(processedResult);
      setSuccessOrder(prev => ({ ...prev, cancel: true }));
    } catch (error) {
      console.error("Error al cancelar la orden:", error);
      setOrderResult({
        success: false,
        message: "Error al procesar la solicitud",
      });
    } finally {
      setCompletingOrder(false);
    }
  };
  
  const handleReset = () => {
    setSuccessOrder({ cancel: false, complete: false });
    setOrderResult(null);
    handlerReset();
  };
  return (
    <>
      {orderData ? (
        <div className="w-full md:container  mx-auto p-2 large:p-4">
          <div className="my-2  text-base ">
            <p className="text-lg">
              El pedido <span className=" ">#{orderData.id}</span> se realizó el{" "}
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
      {/* Botón para completar la orden y componente de resultados */}
      {orderData?.proof_of_payment && orderData?.status_id === "Payment_Pending_ID" && <div className="flex flex-col gap-4 p-4">
        {/* Solo mostrar botones si no hay una operación exitosa */}
        {!successOrder.cancel && !successOrder.complete && (
          <>
            <button
              onClick={async () => {
                handlerUpdateOrder();
              }}
              disabled={completingOrder}
              className={`py-2 px-4 rounded-lg font-medium text-white ${
                completingOrder ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {completingOrder ? "Procesando..." : "Completar Orden"}
            </button>
            <button
              onClick={async () => {
                handlerUpdateCancelOrder();
              }}
              disabled={completingOrder}
              className={`py-2 px-4 rounded-lg font-medium text-white ${
                completingOrder ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {completingOrder ? "Procesando..." : "Cancelar Orden"}
            </button>
          </>
        )}
        {(successOrder.cancel || successOrder.complete) && (
          <button
            onClick={handleReset}
            className="py-2 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Reiniciar
          </button>
        )}
      
        {successOrder.complete && (
         <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-md"> <p>Orden Completada</p></div>
        )}
        {orderResult && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              orderResult.success
                ? "bg-green-100 border border-green-400"
                : "bg-red-100 border border-red-400"
            }`}
          >
            <p
              className={`text-lg font-medium ${
                orderResult.success ? "text-green-700" : "text-red-700"
              }`}
            > {successOrder.cancel && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md"> <p>Orden Cancelada</p></div>
             )}
              {orderResult.message}
            </p>

            {/* Mostrar variaciones con stock insuficiente */}
            {!orderResult.success &&
              orderResult.insufficientStockVariants &&
              orderResult.insufficientStockVariants.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-red-700 mb-2">
                    Variaciones con stock insuficiente:
                  </p>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-red-200">
                          <th className="py-2 px-3 text-left">Variación</th>
                          <th className="py-2 px-3 text-right">Solicitado</th>
                          <th className="py-2 px-3 text-right">Disponible</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderResult.insufficientStockVariants.map(
                          (variant, idx) => (
                            <tr key={idx} className="border-t border-red-300">
                              <td className="py-2 px-3">{variant.title}</td>
                              <td className="py-2 px-3 text-right">
                                {variant.requested}
                              </td>
                              <td className="py-2 px-3 text-right">
                                {variant.available}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Mostrar códigos asignados si la orden fue completada con éxito */}
            {orderResult.success &&
              orderResult.codes &&
              orderResult.codes.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-green-700 mb-2">
                    Códigos asignados:
                  </p>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-200">
                          <th className="py-2 px-3 text-left">Producto</th>
                          <th className="py-2 px-3 text-left">Código</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderResult.codes.map((code, idx) => (
                          <tr key={idx} className="border-t border-green-300">
                            <td className="py-2 px-3">{code.title}</td>
                            <td className="py-2 px-3">
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {code.serialCodes}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>}
    </>
  );
};

export default OrderDetail;
