import React from "react"

const FraudPreventionGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo reconocer una actividad fraudulenta o estafa en las conversaciones
        con vendedores?
      </h2>
      <p className="text-gray-700 mb-6">
        En GudfyP2P tomamos medidas adicionales para protegerte y mantener
        segura tu información. Aquí tienes algunos consejos para evitar posibles
        fraudes mientras hablas con vendedores:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          No compartas información personal
        </h3>
        <p className="text-gray-700 mb-4">
          Tus datos personales no son necesarios para resolver un problema con
          un vendedor.
        </p>
        <p className="text-gray-700 mb-4">
          Sin embargo, el vendedor puede pedirte detalles específicos
          relacionados con el artículo que compraste, como una captura de
          pantalla de un mensaje de error o una confirmación del equipo de
          soporte sobre el problema con tu clave.
        </p>
        <p className="text-gray-700 mb-4">
          Nunca compartas contraseñas, detalles de cuentas personales o
          información de pago (por ejemplo, datos de tarjetas de crédito). Si
          alguien solicita esta información, recházalo inmediatamente.
        </p>
        <p className="text-gray-700">
          Si crees que un vendedor intentó robar tu información personal,
          repórtalo{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Evita enlaces que te lleven fuera de GudfyP2P
        </h3>
        <p className="text-gray-700 mb-4">
          Los enlaces legítimos de GudfyP2P siempre tendrán el dominio exacto
          ".gudfy.com/" con un punto antes de "gudfy.com" y una barra "/"
          después.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Cuidado con reclamos de reembolsos falsos
        </h3>
        <p className="text-gray-700 mb-4">
          La única forma segura de recibir un reembolso de un vendedor es
          aceptar una oferta de reembolso en la conversación.
        </p>
        <p className="text-gray-700 mb-4">
          Si un vendedor dice que te reembolsó, pero no ves una oferta de
          reembolso ni recibiste una notificación por correo, podría ser
          sospechoso.
        </p>
        <p className="text-gray-700">
          Para confirmar, inicia sesión en tu Panel de control de GudfyP2P y
          verifica el estado de tu pedido o contacta a nuestro soporte{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          No hagas clic en enlaces externos ni completes formularios externos
          para reembolsos
        </h3>
        <p className="text-gray-700 mb-4">
          Evita herramientas externas como software de pantalla compartida. Los
          vendedores tienen las herramientas necesarias dentro de GudfyP2P para
          resolver problemas sin necesidad de estas.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          La ayuda es prioridad, las calificaciones son secundarias
        </h3>
        <p className="text-gray-700 mb-4">
          Resolver el problema con el artículo debe ser tu prioridad.
        </p>
        <p className="text-gray-700">
          Si un vendedor te pide que cambies tu calificación primero, recuerda
          que no estás obligado a hacerlo. La ayuda no depende de esto.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Comunicación con los vendedores
        </h3>
        <p className="text-gray-700">
          Si el vendedor usa herramientas externas para entregarte tu artículo,
          asegúrate de que cualquier problema adicional se maneje siempre dentro
          del módulo de conversaciones de GudfyP2P.
        </p>
      </div>
    </div>
  )
}

export default FraudPreventionGuide
