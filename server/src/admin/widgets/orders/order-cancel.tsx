"use client";
import React, { useEffect } from "react";
import type { order } from "../../widgets/orders/index";
import { formatDate } from "../../utils/format-date";

import Link from "next/link";
// import Timer from "@lib/util/timer-order"

import { useState } from "react";

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

  const [storeReviewData, setStoreReviewData] = useState<propsStoreReviwe>({
    store_name: " ",
    store_id: " ",
    store_order_id: " ",
    customer_name: " ",
    customer_id: " ",
    content: " ",
    rating: 0,
  });
  return (
    <div className="w-full md:container  mx-auto p-0 md:p-4">
      <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
        Detalles del pedido
      </h2>

      {/* Tabla Responsiva */}
      <div className="m-4 overflow-x-auto">
        <table className="min-w-full rounded-lg shadow-md text-sm">
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
                  <div className="text-xs font-light mt-2 w-[30%]">
                    <p>
                      Vendido por:{" "}
                      <Link
                        className="text-blue-500 capitalize"
                        href={`/seller/store/${p.store_id}`}
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
      <div className="p-4 text-sm text-center ">
        <p>
          El pedido <span className="font-bold">#{orderData.id}</span> se
          realizó el{" "}
          <span className="font-bold">{formatDate(orderData.created_at)}</span>y
          está actualmente{" "}
          <span className={"text-red-500"}>{orderData.state_order}</span>.
        </p>
      </div>
    </div>
  );
};

export default OrderCancel;
