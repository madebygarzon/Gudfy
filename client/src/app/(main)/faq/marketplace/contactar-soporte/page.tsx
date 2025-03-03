import React from "react"

const ContactSupportGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Tengo un problema diferente. ¿Cómo puedo comunicarme con el soporte de
        Gudfy?
      </h2>
      <p className="text-gray-700 mb-6">
        Si tu problema no está listado en ninguna de nuestras categorías o
        artículos de ayuda, no te preocupes, ¡estamos aquí para ayudarte!
      </p>
      <p className="text-gray-700 mb-6">
        Recuerda que cualquier problema con tu artículo digital debe ser
        reportado primero al vendedor.
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Cómo puedo contactarlos?
        </h3>
        <p className="text-gray-700 mb-4">
          Puedes comunicarte con nuestro equipo de soporte utilizando las
          siguientes opciones:
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            A través del Centro de Soporte
          </h4>
          <p className="text-gray-700 mb-4">
            Visita la pestaña de Tickets en el Centro de Soporte{" "}
            <a href="#" className="text-blue-500 underline">
              AQUÍ
            </a>
            . Esto abrirá un formulario para que lo completes.
          </p>
          <p className="text-gray-700 mb-4">
            Si tienes una cuenta en GudfyP2P, inicia sesión y crea tu ticket.
          </p>
          <p className="text-gray-700">
            Si no tienes una cuenta, puedes enviarnos un correo electrónico con
            una explicación detallada de tu problema directamente a{" "}
            <a
              href="mailto:soporte@gudfy.com"
              className="text-blue-500 underline"
            >
              soporte@gudfy.com
            </a>
            .
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Vía WhatsApp</h4>
          <p className="text-gray-700">
            También puedes contactarnos a través de WhatsApp para recibir ayuda
            rápida.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Vía correo electrónico
          </h4>
          <p className="text-gray-700">
            Envíanos un correo a{" "}
            <a
              href="mailto:soporte@gudfy.com"
              className="text-blue-500 underline"
            >
              soporte@gudfy.com
            </a>{" "}
            con una descripción completa de tu problema o consulta.
          </p>
        </div>

        <p className="text-gray-700 mb-4">
          Asegúrate de proporcionar toda la información posible, como el número
          de pedido o transacción, el nombre del artículo y una descripción
          detallada de tu problema. Cuanta más información proporciones, más
          rápido podremos ayudarte.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Cuánto tiempo tarda el soporte en responder?
        </h3>
        <p className="text-gray-700">
          El tiempo de respuesta depende del volumen de solicitudes y la
          complejidad de tu consulta. Recibirás una notificación por correo
          electrónico cuando respondamos a tu ticket, así que revisa tu bandeja
          de entrada con frecuencia.
        </p>
      </div>
    </div>
  )
}

export default ContactSupportGuide
