import React from "react"

const OrderStatusGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo puedo verificar el estado de mi pedido?
      </h2>
      <p className="text-gray-700 mb-4">
        Puedes verificar el estado de tu pedido en la pestaña "Mis órdenes"
        dentro de tu panel de control en GudfyP2P. Si aún no has recibido tu
        artículo digital, localiza el pedido en cuestión en la lista y revisa el
        campo "Estado del pago" en la parte superior derecha.
      </p>
      <p className="text-gray-700 mb-6">
        Si aún no tienes una cuenta en GudfyP2P, puedes registrarte{" "}
        <a href="/account" className="text-blue-500 underline">
          AQUÍ
        </a>
        .
      </p>

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        ¿Qué significa cada estado del pedido?
      </h3>
      <p className="text-gray-700 mb-4">
        Cada estado representa una etapa diferente de tu pedido. Los estados son
        los siguientes:
      </p>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Esperando pago</h4>
        <p className="text-gray-700 mb-4">
          Esto significa que tu pago aún no ha sido completado o que no lo hemos
          recibido. Si no utilizaste un método de pago instantáneo, puede tomar
          un poco más de tiempo que el operador procese tu transacción.
        </p>
        <p className="text-gray-700">
          También puede significar que cancelaste el pago o que no lo iniciaste.
          En este caso, puedes ignorar el pedido o cancelarlo manualmente.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">En Discusión</h4>
        <p className="text-gray-700">
          Si presentas problemas con tu pedido y se encuentra en estado re
          reclamación con el vendedor de tus productos.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Completado</h4>
        <p className="text-gray-700 mb-4">
          Tu pedido ha sido completado y el artículo fue enviado a tu correo
          electrónico. También puedes verificar la pestaña "Mis claves" en tu
          panel de control para reclamar tu artículo. Para más información sobre
          cómo recibir tu artículo, haz clic{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Cancelado</h4>
        <p className="text-gray-700">
          Esto significa que cancelaste el pedido manualmente o que el pago
          falló y fue cancelado automáticamente por nuestro sistema. Si tu pago
          fue rechazado, no se te cobrará por ese pedido.
        </p>
      </div>
    </div>
  )
}

export default OrderStatusGuide
