import React from "react"

const ArticleIssueGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        El artículo que compré no funciona o dejó de funcionar
      </h2>
      <p className="text-gray-700 mb-6">
        Si encuentras problemas al activar tu artículo digital, como mensajes de
        error que indican "inválido", "bloqueado por región", "usado" o
        "revocado", sigue estas recomendaciones para resolver la situación:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Mi artículo es inválido
        </h3>
        <p className="text-gray-700 mb-4">Verifica lo siguiente:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            ¿Estás activando el artículo en la plataforma correcta? Las claves
            de juego son específicas para una plataforma, como Steam o EA App.
            Puedes consultar la plataforma correspondiente en la página del
            artículo en GudfyP2P.
          </li>
          <li>
            ¿Copiaste correctamente el artículo? Si recibiste más de una clave
            (por ejemplo, acceso al juego base y a un DLC), asegúrate de
            copiarlas de forma separada.
          </li>
        </ul>
        <p className="text-gray-700">
          Si el problema persiste, contacta al vendedor del artículo. Puedes
          consultar nuestra guía sobre cómo contactar al vendedor{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Mi artículo está bloqueado por región
        </h3>
        <p className="text-gray-700 mb-4">
          Verifica si compraste el artículo para la región correcta. Esto lo
          puedes confirmar revisando la página del artículo en GudfyP2P.
        </p>
        <p className="text-gray-700 mb-4">
          Algunos artículos tienen restricciones regionales y solo pueden
          activarse en determinadas áreas.
        </p>
        <p className="text-gray-700">
          Si el artículo debería funcionar en tu región según la página del
          producto, pero no lo hace, contacta al vendedor para informar del
          problema.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Mi artículo ya fue usado
        </h3>
        <p className="text-gray-700 mb-4">
          Cierra sesión en tu cuenta y vuelve a iniciar sesión, luego revisa tu
          biblioteca nuevamente. Si intentaste activar la clave varias veces, es
          posible que ya esté activada pero no aparezca en tu biblioteca.
        </p>
        <p className="text-gray-700">
          Si el problema persiste y estás seguro de que no usaste la clave,
          contacta al vendedor para informar del problema. Nuestra guía para
          contactar al vendedor está disponible{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Mi artículo ha sido revocado
        </h3>
        <p className="text-gray-700 mb-4">
          Si recibiste información de que el artículo fue desactivado por el
          desarrollador, contacta al vendedor de inmediato para notificar lo
          ocurrido.
        </p>
        <p className="text-gray-700">
          El vendedor debería ayudarte a resolver este problema. Consulta
          nuestra guía para contactar al vendedor{" "}
          <a href="#" className="text-blue-500 underline">
            AQUÍ
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default ArticleIssueGuide
