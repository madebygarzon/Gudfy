import React from "react"

const WithdrawMoneyGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo puedo retirar mi dinero?
      </h2>
      <p className="text-gray-700 mb-6">
        Puedes retirar tu dinero una semana después de que cada venta se haya
        completado exitosamente.
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Dinero congelado por reclamaciones
        </h3>
        <p className="text-gray-700">
          El dinero de las ventas que se encuentren en estado de reclamación
          estará congelado hasta que la disputa sea resuelta. Solo se liberará
          el dinero correspondiente a las órdenes culminadas y sin problemas.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Proceso de retiro
        </h3>
        <p className="text-gray-700">
          Los retiros se realizarán directamente con servicio al cliente.
        </p>
      </div>
    </div>
  )
}

export default WithdrawMoneyGuide
