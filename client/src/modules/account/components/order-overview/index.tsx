import React from "react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import clsx from "clsx"
import Link from "next/link"
import Timer from "@lib/util/timer-order"
import { useMeCustomer } from "medusa-react"

type props = {
  orderData: order
  onClose: () => void
  handlerReset: () => void
}
const OrderDetails = ({ orderData, onClose, handlerReset }: props) => {
  const { customer } = useMeCustomer()
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <p className="text-base">
          El pedido{" "}
          <span className="font-bold">
            #{orderData.id.replace("store_order_id_", "")}
          </span>{" "}
          se realizó el{" "}
          <span className="font-bold">
            {handlerformatDate(orderData.created_at)}
          </span>{" "}
          y está actualmente{" "}
          <span
            className={clsx("font-bold", {
              " text-red-500": orderData.state_order === "Cancelado",
              " text-green-500": orderData.state_order === "Completado",
              " text-yellow-500": orderData.state_order === "Pendiente de pago",
              " text-blue-500": orderData.state_order === "Finalizado",
              " text-orange-500": orderData.state_order === "En discusión",
            })}
          >
            {orderData.state_order}
          </span>
          .
          <span className="flex text-sm gap-1">
            Cancelacion automatica:
            <Timer creationTime={orderData.created_at} />
          </span>
        </p>
      </div>
      <p className="font-bold text-sm">
        {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}
      </p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Detalles del pedido</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Producto</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData.store_variant.map((p) => (
              <tr className="border-b">
                <td className="py-2 px-4 border-r  flex justify-between">
                  <div>
                    {p.produc_title} – ${p.price} USD x {p.quantity}
                    <br />
                  </div>
                  <div className="text-sm font-light">
                    <p>por: {p.store_name}</p>
                    {orderData.state_order === "Completado"}{" "}
                    <Link className="text-indigo-600 text-xs" href={"/"}>
                      califica esta tienda
                    </Link>
                  </div>
                </td>
                <td className="py-2 px-4 border-b ">
                  ${p.total_price_for_product} USD
                </td>
              </tr>
            ))}
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Subtotal:</td>
              <td className="py-2 px-4 border-r">
                $
                {orderData.store_variant.reduce((sum, p) => {
                  return sum + parseFloat(p.total_price_for_product)
                }, 0)}{" "}
                USD
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r ">
                Comisión de la pasarela de pago:
              </td>
              <td className="py-2 px-4 ">$0.23</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Método de pago:</td>
              <td className="py-2 px-4 ">Binance Pay Entrega Automática</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Total:</td>
              <td className="py-2 px-4 border-b">
                $
                {orderData.store_variant.reduce((sum, p) => {
                  return sum + parseFloat(p.total_price_for_product)
                }, 0.23)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full"></div>
    </div>
  )
}

export default OrderDetails
