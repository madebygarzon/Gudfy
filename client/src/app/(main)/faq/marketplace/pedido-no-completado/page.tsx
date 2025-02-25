import React from "react"

const PaymentProcessingInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Procesamiento de Transacción
      </h2>
      <p className="text-gray-700 mb-4">
        El procesamiento de una transacción puede tomar varios minutos,
        dependiendo del método de pago que hayas elegido. Aquí hay algunas
        recomendaciones:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>No cierres la ventana de pago ni retrocedas</li>
        <li>
          Es importante no cerrar la ventana del navegador durante el proceso de
          pago ni retroceder si la transacción ya está en curso.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        Si cerraste accidentalmente el navegador y el dinero fue descontado:
      </p>
      <p className="text-gray-700 mb-4">
        Si cerraste el navegador y el dinero fue descontado de tu cuenta sin
        completar el pedido, comunícate con nuestro equipo de soporte creando un
        ticket{" "}
        <a href="#" className="text-blue-500 underline">
          AQUÍ
        </a>
        . Revisaremos tu caso para ofrecerte una solución.
      </p>
    </div>
  )
}

export default PaymentProcessingInfo
