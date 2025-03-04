import React from "react"

const OrderReviewGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo puedo revisar mis pedidos y obtener mis artículos digitales usando
        mi panel de control?
      </h2>
      <p className="text-gray-700 mb-6">
        Revisar tus pedidos y acceder a tus artículos digitales en GudfyP2P es
        sencillo. Sigue estos pasos:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Inicia sesión en tu cuenta
        </h3>
        <p className="text-gray-700">
          Asegúrate de estar conectado a tu cuenta para acceder al panel de
          control.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Accede a "Mis órdenes"
        </h3>
        <p className="text-gray-700">
          En el menú de navegación, selecciona la opción "Mis órdenes". Aquí
          verás un listado con todos tus pedidos y sus estados (por ejemplo,
          Completado, Finalizado o Cancelado).
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Selecciona el pedido que deseas revisar
        </h3>
        <p className="text-gray-700">
          Haz clic en el botón "Ver detalle de la orden" correspondiente al
          pedido que quieres revisar.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Obtén detalles del pedido
        </h3>
        <p className="text-gray-700 mb-4">
          Una vez dentro de los detalles del pedido, podrás ver información
          importante, como:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Producto comprado.</li>
          <li>Número de pedido.</li>
          <li>Método de pago utilizado.</li>
          <li>Estado del pedido (por ejemplo, Completado).</li>
          <li>
            Si el artículo es digital, aquí encontrarás los códigos o enlaces
            proporcionados por el vendedor para acceder a tu compra.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. Finaliza o presenta un reclamo
        </h3>
        <p className="text-gray-700 mb-4">
          Si todo está correcto, puedes marcar la orden como "Finalizar Compra".
        </p>
        <p className="text-gray-700">
          Si hay un problema, haz clic en "Presentar Reclamo" para contactar al
          vendedor dentro del plazo indicado (normalmente 10 días).
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          6. Descarga o utiliza tu artículo digital
        </h3>
        <p className="text-gray-700">
          Una vez que el pedido esté marcado como completado, podrás descargar o
          usar tu artículo directamente desde esta sección.
        </p>
      </div>
    </div>
  )
}

export default OrderReviewGuide
