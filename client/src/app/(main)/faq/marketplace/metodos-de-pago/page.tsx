import React from "react"

const PaymentMethodsInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Métodos de Pago en GudfyP2P
      </h2>
      <p className="text-gray-700 mb-4">
        En GudfyP2P ofrecemos diversas opciones de pago para adaptarnos a tus
        necesidades. Los métodos disponibles son:
      </p>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Binance Pay</h3>
        <p className="text-gray-700">
          Este método permite entrega automática, por lo que recibirás los
          códigos de tu compra de inmediato si el proveedor ofrece esta opción.
        </p>
        <p className="text-gray-700">
          También puede incluir entrega manual, donde la transacción será
          aprobada por nuestro equipo de administración antes de recibir los
          artículos.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Red USDT-TRC20</h3>
        <p className="text-gray-700">
          Realiza pagos utilizando la red USDT-TRC20, una opción rápida y
          económica para transacciones en criptomonedas.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Criptomonedas</h3>
        <p className="text-gray-700">
          También aceptamos pagos con las siguientes criptomonedas:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Bitcoin</li>
          <li>Ethereum</li>
          <li>Litecoin</li>
        </ul>
      </div>
      <p className="text-gray-700">
        Estos métodos aseguran una experiencia de pago segura, rápida y flexible
        para todos nuestros usuarios.
      </p>
    </div>
  )
}

export default PaymentMethodsInfo
