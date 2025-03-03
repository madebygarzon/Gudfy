import React from "react"

const BalanceDifferenceGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Diferencia entre saldo total y saldo disponible
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Saldo total</h3>
        <p className="text-gray-700">
          Es el monto acumulado de todas las ventas realizadas.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Saldo disponible
        </h3>
        <p className="text-gray-700">
          Es el dinero de tus ventas que está sin reclamaciones, es decir, listo
          para ser retirado.
        </p>
      </div>
    </div>
  )
}

export default BalanceDifferenceGuide
