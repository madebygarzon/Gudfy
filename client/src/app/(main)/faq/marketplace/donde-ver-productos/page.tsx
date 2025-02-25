import React from "react"

const DeliveryInfo = () => {
  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-blue-gf mb-4">
        Cómo recibir tu pedido
      </h2>

      <div className="space-y-6">
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-700">
            1. Entrega instantánea al finalizar la compra
          </h3>
          <p className="text-gray-700 mt-2">
            Si el vendedor ofrece entrega instantánea, no cierres tu navegador
            después de completar la compra. Espera a que el pedido sea
            confirmado y completado. Luego, dirígete a la sección "Mis pedidos",
            ve el detalle de tu orden ¡y listo!
          </p>
        </div>

        <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-md">
          <h3 className="text-lg font-semibold text-green-700">
            2. A través del correo de confirmación
          </h3>
          <p className="text-gray-700 mt-2">
            Si no recibes el artículo de inmediato, revisa tu correo
            electrónico. Busca el mensaje enviado por GudfyP2P al email que
            proporcionaste durante la compra. Si no lo encuentras, revisa la
            carpeta de spam o correo no deseado. Puede tomar unos minutos en
            llegar.
          </p>
        </div>

        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
          <h3 className="text-lg font-semibold text-yellow-700">
            3. En la sección "Mis pedidos" de tu cuenta
          </h3>
          <p className="text-gray-700 mt-2">
            Todos los artículos que adquieras estarán disponibles en la pestaña
            "Mis pedidos". Puedes acceder a ellos en cualquier momento iniciando
            sesión en tu cuenta de GudfyP2P.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInfo
