import React from "react"

const AddCodesGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo agregar códigos en una oferta?
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Accede a tu tienda
        </h3>
        <p className="text-gray-700">
          Inicia sesión en tu cuenta de GudfyP2P y dirígete a la sección "Mi
          tienda" desde el panel de control.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Ve a la sección de productos
        </h3>
        <p className="text-gray-700 mb-4">
          Haz clic en "Productos" para ver la lista de los productos que tienes
          en tu tienda.
        </p>
        <p className="text-gray-700">
          Busca el producto en el cual deseas agregar códigos.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Selecciona la opción de editar
        </h3>
        <p className="text-gray-700 mb-4">
          Haz clic en el ícono de "Editar" (representado por un lápiz) al lado
          del producto que quieres modificar.
        </p>
        <p className="text-gray-700">
          Esto abrirá una ventana emergente con la información del producto.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Agrega los códigos
        </h3>
        <p className="text-gray-700 mb-4">
          En la ventana de edición, busca la opción "Agregar ítems".
        </p>
        <p className="text-gray-700 mb-4">
          Haz clic en "Seleccionar archivo .txt" y sube un archivo que contenga
          los códigos.
        </p>
        <p className="text-gray-700 mb-4">
          Asegúrate de que los códigos estén en un formato válido y sin errores.
        </p>
        <p className="text-gray-700">
          Revisa la cantidad de códigos que se mostrarán en el inventario
          después de la carga.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. Guarda los cambios
        </h3>
        <p className="text-gray-700 mb-4">
          Una vez que los códigos estén listos, haz clic en el botón "Guardar".
        </p>
        <p className="text-gray-700">
          Verás una confirmación indicando que los códigos se han agregado
          correctamente.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Consejos adicionales:
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <strong>Formato del archivo .txt:</strong> Asegúrate de que cada
            código esté en una línea separada para evitar problemas de carga.
          </li>
          <li>
            <strong>Revisa tu inventario:</strong> Verifica que la cantidad de
            códigos en el inventario sea correcta después de guardarlos.
          </li>
          <li>
            <strong>Actualiza frecuentemente:</strong> Mantén tu inventario al
            día para garantizar que siempre tengas disponibilidad para los
            compradores.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AddCodesGuide
