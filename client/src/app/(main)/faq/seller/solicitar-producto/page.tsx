import React from "react"

const RequestProductGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿No ves el producto que deseas en nuestra lista de productos?
      </h2>
      <p className="text-gray-700 mb-6">
        Si no encuentras el producto que deseas ofrecer, sigue estos pasos para
        solicitarlo:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Haz clic en "Solicitar producto"
        </h3>
        <p className="text-gray-700">
          Encuentra y haz clic en el botón "Solicitar producto" en tu panel de
          control.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Llena el formulario
        </h3>
        <p className="text-gray-700">
          Completa el formulario con los detalles del producto que deseas
          agregar, como el nombre, descripción, categoría y cualquier otra
          información relevante.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Espera la revisión
        </h3>
        <p className="text-gray-700">
          La administración revisará tu solicitud para asegurarse de que cumple
          con las políticas de GudfyP2P.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Sube el producto a tu tienda
        </h3>
        <p className="text-gray-700">
          Una vez que tu solicitud sea aprobada, podrás subir el producto a tu
          tienda y comenzar a venderlo.
        </p>
      </div>
    </div>
  )
}

export default RequestProductGuide
