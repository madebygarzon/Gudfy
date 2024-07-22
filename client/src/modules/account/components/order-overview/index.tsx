import React from "react"

type props = {
  onClose: () => void
  handlerReset: () => void
}
const OrderDetails = ({ onClose, handlerReset }: props) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <p className="text-lg">
          El pedido <span className="font-bold">#298969</span> se realizó el{" "}
          <span className="font-bold">2024-07-10 17:34</span> y está actualmente{" "}
          <span className="font-bold text-red-500">Cancelado</span>.
        </p>
      </div>

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
            <tr>
              <td className="py-2 px-4 border-b">
                Netflix Colombia – 30.000 COP x 3
                <br />
                Price: 30.000 COP
              </td>
              <td className="py-2 px-4 border-b">$23.02</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Subtotal:</td>
              <td className="py-2 px-4 border-b">$23.02</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">
                Comisión de la pasarela de pago:
              </td>
              <td className="py-2 px-4 border-b">$0.23</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Método de pago:</td>
              <td className="py-2 px-4 border-b">
                Binance Pay Entrega Automática
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total:</td>
              <td className="py-2 px-4 border-b">$23.25</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Dirección de facturación</h2>
        <div className="p-4 border border-gray-200">
          <p className="font-bold">Carlos Garzon</p>
          <p>Manizales</p>
          <p className="mt-4">
            <span className="font-bold">Tel:</span> 3217979089
          </p>
          <p>
            <span className="font-bold">Email:</span> madebygarzon@gmail.com
          </p>
        </div>
      </div>
      <div className="w-full"></div>
    </div>
  )
}

export default OrderDetails
