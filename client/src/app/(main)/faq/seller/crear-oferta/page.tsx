import React from "react"

const CreateOfferGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo crear una oferta?
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Accede a tu tienda
        </h3>
        <p className="text-gray-700">
          Inicia sesión en tu cuenta y dirígete a la sección "Mi tienda" desde
          el panel de control.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Selecciona "Agregar productos"
        </h3>
        <p className="text-gray-700 mb-4">
          Haz clic en el botón "Agregar productos" en tu tienda.
        </p>
        <p className="text-gray-700">
          Esto te llevará a una lista de productos disponibles.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Busca y selecciona el producto
        </h3>
        <p className="text-gray-700 mb-4">
          Utiliza la barra de búsqueda para encontrar el producto que deseas
          agregar.
        </p>
        <p className="text-gray-700">
          Haz clic en "Agregar a mi tienda" para seleccionarlo.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Configura los detalles de la oferta
        </h3>
        <p className="text-gray-700 mb-4">
          Carga el inventario: Sube un archivo con los códigos (si es un
          producto digital) utilizando el botón "Seleccionar archivo .txt".
        </p>
        <p className="text-gray-700 mb-4">
          Establece el precio: Introduce el precio por unidad en el campo
          correspondiente.
        </p>
        <p className="text-gray-700">
          Verifica que todos los detalles sean correctos antes de continuar.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. Guarda la oferta
        </h3>
        <p className="text-gray-700 mb-4">
          Una vez configurados los detalles, haz clic en "Guardar productos".
        </p>
        <p className="text-gray-700">
          Recibirás una confirmación indicando que los productos se agregaron
          correctamente.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          6. Revisa tu lista de productos
        </h3>
        <p className="text-gray-700 mb-4">
          Regresa a la sección de "Productos" en tu tienda para verificar que el
          nuevo producto y la oferta estén activos.
        </p>
        <p className="text-gray-700">
          Aquí también podrás editar o eliminar productos si es necesario.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          7. ¿No ves el producto que deseas en nuestra lista de productos?
        </h3>
        <p className="text-gray-700 mb-4">
          Si no encuentras el producto que deseas ofrecer, haz clic en el botón
          "Solicitar producto".
        </p>
        <p className="text-gray-700 mb-4">
          Llena el formulario con los detalles del producto que deseas agregar.
        </p>
        <p className="text-gray-700">
          La administración se encargará de revisar y aceptar tu solicitud. Una
          vez aprobado, podrás subir el producto a tu tienda.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Consejos adicionales:
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <strong>Asegúrate de tener suficiente inventario disponible</strong>{" "}
            antes de publicar la oferta.
          </li>
          <li>
            <strong>Proporciona precios competitivos</strong> para atraer más
            compradores.
          </li>
          <li>
            <strong>Actualiza regularmente tu lista de productos</strong> para
            mantener tu tienda atractiva.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CreateOfferGuide
