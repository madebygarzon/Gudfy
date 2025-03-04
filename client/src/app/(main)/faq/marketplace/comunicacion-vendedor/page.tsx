import React from "react"

const ContactSellerGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo puedo comunicarme con el vendedor si tengo un problema con mi
        compra?
      </h2>
      <p className="text-gray-700 mb-6">
        Si necesitas contactar al vendedor por un problema con tu pedido, sigue
        estos pasos:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Inicia sesión en tu cuenta de GudfyP2P
        </h3>
        <p className="text-gray-700">
          Asegúrate de usar la misma cuenta con la que realizaste tu compra.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Accede a la sección "Mis órdenes"
        </h3>
        <p className="text-gray-700">
          Ve a la pestaña "Mis órdenes" en tu Panel de control.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Selecciona el pedido con problemas
        </h3>
        <p className="text-gray-700">
          Busca la orden correspondiente en tu lista y haz clic en "Ver
          detalles".
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Presenta un reclamo
        </h3>
        <p className="text-gray-700">
          Dentro de los detalles de la orden, haz clic en el botón "Presentar
          reclamo". Desde ahí, podrás contactar al vendedor directamente para
          solucionar el problema.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Nota importante:
        </h3>
        <p className="text-gray-700">
          Si marcaste la orden como "Finalizada", ya no podrás contactar al
          vendedor. Esto significa que tu pedido se completó correctamente y no
          requiere atención adicional.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Si el vendedor te ofrece un reembolso
        </h3>
        <p className="text-gray-700 mb-4">
          Si el vendedor decide ofrecerte un reembolso, recibirás una
          notificación automática en la conversación iniciada con él. Podrás
          aceptar o rechazar el reembolso directamente en la conversación.
        </p>
        <p className="text-gray-700 mb-4">
          En caso de que aceptes el reembolso, podrás optar por:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Solicitar un código que podrás utilizar como saldo para realizar una
            nueva compra en la plataforma.
          </li>
          <li>
            Recibir el dinero directamente en tu billetera, para lo cual deberás
            contactar con administración y seguir las instrucciones para el
            proceso.
          </li>
        </ul>
        <p className="text-gray-700">
          <strong>Importante:</strong> Este es el único medio seguro para
          recibir un reembolso. No hagas clic en enlaces externos que parezcan
          ofrecer reembolsos para evitar riesgos de seguridad.
        </p>
      </div>
    </div>
  )
}

export default ContactSellerGuide
