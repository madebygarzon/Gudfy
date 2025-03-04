import React from "react"

const ContactSellerInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cuándo debería contactar al vendedor?
      </h2>
      <p className="text-gray-700 mb-6">
        Puedes contactar al vendedor para hacer preguntas generales o
        específicas relacionadas con los productos que ofrecen en GudfyP2P.
        Algunos ejemplos incluyen:
      </p>

      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>¿Cómo puedo activar este artículo exactamente?</li>
        <li>¿En qué plataforma(s) funciona este producto?</li>
        <li>¿Cuál es la versión del artículo digital o programa?</li>
      </ul>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Debo contactar al vendedor si hay un problema con mi artículo?
        </h3>
        <p className="text-gray-700 mb-4">
          ¡Sí! Los vendedores en GudfyP2P tienen la responsabilidad de resolver
          problemas relacionados con tus artículos. Esto incluye ofrecer un
          reemplazo o un reembolso si es necesario.
        </p>
        <p className="text-gray-700">
          Si tienes dudas o problemas con tu compra, contacta al vendedor
          primero. Sigue{" "}
          <a href="#" className="text-blue-500 underline">
            ESTA GUÍA
          </a>{" "}
          para saber cómo contactarlo.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Hay algo con lo que el vendedor no me puede ayudar?
        </h3>
        <p className="text-gray-700 mb-4">
          Los vendedores no pueden ajustar los precios de manera individual para
          un comprador. GudfyP2P no permite negociaciones ni subastas, y los
          pagos solo se realizan a través del sistema de checkout dedicado.
        </p>
        <p className="text-gray-700">
          Los vendedores no pueden resolver problemas de pago. Si encuentras un
          problema durante el proceso de pago, revisa nuestra categoría de
          soporte dedicada a Pagos para encontrar una solución.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Qué más debo saber?
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Sé paciente y cooperativo: los vendedores pueden necesitar tiempo
            para verificar el problema y responder. Es posible que te pidan más
            detalles para resolver la situación de manera adecuada.
          </li>
          <li>
            Escribe en un idioma comprensible: si es posible, comunícate en
            inglés, ya que GudfyP2P es un marketplace global y el vendedor puede
            tener dificultades para entender otros idiomas.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ContactSellerInfo
