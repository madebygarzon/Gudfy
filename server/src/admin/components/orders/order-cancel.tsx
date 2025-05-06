"use client";
import React, { useEffect } from "react";
import type { order } from "../../widgets/orders/index";
import { formatDate } from "../../utils/format-date";

import Link from "next/link";
// import Timer from "@lib/util/timer-order"

import { useState } from "react";
import { updateOrderToCompleted } from "../../actions/orders/update-order-to-completed";

type props = {
  orderData: order;
};
type propsStoreReviwe = {
  store_name: string;
  store_id: string;
  store_order_id: string;
  rating: number;
  customer_name: string;
  customer_id: string;
  content: string;
};
const OrderCancel = ({ orderData }: props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [completingOrder, setCompletingOrder] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const [storeReviewData, setStoreReviewData] = useState<propsStoreReviwe>({
    store_name: " ",
    store_id: " ",
    store_order_id: " ",
    customer_name: " ",
    customer_id: " ",
    content: " ",
    rating: 0,
  });

  const handlerUpdateOrder = async () => {
    try {
      setCompletingOrder(true);
      const result = await updateOrderToCompleted(orderData.id);
      setOrderResult(result);
    } catch (error) {
      console.error("Error al completar la orden:", error);
      setOrderResult({
        success: false,
        message: "Error al procesar la solicitud"
      });
    } finally {
      setCompletingOrder(false);
    }
  }
  return (
    <div className="w-full md:container  mx-auto p-0 md:p-4">
      <div className="p-4 text-lg  ">
        <p>
          El pedido <span className="font-bold">#{orderData.id}</span> se
          realizó el{" "}
          <span className="font-bold">{formatDate(orderData.created_at)}</span>y
          está actualmente{" "}
          <span className={"text-red-500"}>{orderData.state_order}</span>.
        </p>
      </div>

      {/* Tabla Responsiva */}
      <div className="m-4 overflow-x-auto">
        <table className="min-w-full rounded-lg shadow-md text-base text-start">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-b border-slate-200">Producto</th>
              <th className="py-2 px-4 border-b border-slate-200">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.store_variant.map((p, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="py-2 px-4 border-r border-slate-200 flex justify-between flex-wrap">
                  <div className="w-[70%]">
                    {p.produc_title} – ${p.price} USD x {p.quantity}
                  </div>
                  <div className="text-sm  font-light mt-2 w-[30%]">
                    <p>
                      Vendido por:{" "}
                      <Link
                        className="text-blue-500 capitalize"
                        href={`/seller-store/${p.store_id}`}
                      >
                        {p.store_name}
                      </Link>
                    </p>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-slate-200">
                  ${p.total_price_for_product} USD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información del pedido */}
      
      {/* Botón para completar la orden y componente de resultados */}
      <div className="mt-6 flex flex-col gap-4 p-4">
        <button
          onClick={async () => {
           handlerUpdateOrder();
          }}
          disabled={completingOrder}
          className={`py-2 px-4 rounded-lg font-medium text-white ${completingOrder ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {completingOrder ? "Procesando..." : "Completar Orden"}
        </button>
        
        {orderResult && (
          <div className={`mt-4 p-4 rounded-lg ${orderResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
            <p className={`text-lg font-medium ${orderResult.success ? 'text-green-700' : 'text-red-700'}`}>
              {orderResult.message}
            </p>
            
            {/* Mostrar variaciones con stock insuficiente */}
            {!orderResult.success && orderResult.insufficientStockVariants && orderResult.insufficientStockVariants.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-red-700 mb-2">Variaciones con stock insuficiente:</p>
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
                      {orderResult.insufficientStockVariants.map((variant, idx) => (
                        <tr key={idx} className="border-t border-red-300">
                          <td className="py-2 px-3">{variant.title}</td>
                          <td className="py-2 px-3 text-right">{variant.requested}</td>
                          <td className="py-2 px-3 text-right">{variant.available}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Mostrar códigos asignados si la orden fue completada con éxito */}
            {orderResult.success && orderResult.codes && orderResult.codes.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-green-700 mb-2">Códigos asignados:</p>
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
                          <td className="py-2 px-3"><code className="bg-gray-100 px-2 py-1 rounded">{code.serialCodes}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCancel;
