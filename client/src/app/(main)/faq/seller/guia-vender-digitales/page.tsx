import React from "react"

const DigitalSellingGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Guía completa para vender artículos digitales
      </h2>
      <p className="text-gray-700 mb-6">
        Si estás interesado en vender artículos digitales en GudfyP2P, es
        importante conocer qué tipo de claves y productos puedes ofrecer, además
        de seguir las mejores prácticas para maximizar tu éxito como vendedor.
        Aquí te presentamos una guía completa:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Qué claves son elegibles para la venta en GudfyP2P?
        </h3>
        <p className="text-gray-700 mb-4">
          En general, los vendedores pueden ofrecer cualquier clave válida y sin
          usar que posean, siempre que cumplan con las políticas del
          marketplace. Ten en cuenta lo siguiente:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Cuando compras un artículo digital, adquieres la clave, pero no el
            contenido en sí, que sigue siendo propiedad del editor o
            desarrollador.
          </li>
          <li>
            Algunos productos están restringidos a vendedores con verificación
            comercial específica.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Artículos digitales que puedes vender en GudfyP2P
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>Software:</strong> Herramientas de productividad, programas
            de diseño, antivirus, y más.
          </li>
          <li>
            <strong>Claves de juegos:</strong> Claves para plataformas populares
            como Steam, Origin, y Ubisoft, entre otras. Puedes vender tanto
            lanzamientos recientes como títulos clásicos.
          </li>
          <li>
            <strong>Tarjetas de regalo y vales:</strong> Tarjetas para
            plataformas como PlayStation, Xbox, Steam y servicios en línea.
          </li>
          <li>
            <strong>Códigos de suscripción:</strong> Suscripciones para
            servicios de streaming, software y más.
          </li>
          <li>
            <strong>Cuentas de juegos:</strong> Aunque es posible vender
            cuentas, debes cumplir con las directrices de GudfyP2P para
            garantizar transparencia y legalidad.
          </li>
          <li>
            <strong>Skins e ítems de juegos:</strong> Artículos digitales como
            skins, ítems y monedas virtuales para juegos en línea.
          </li>
          <li>
            <strong>Arte y diseños digitales:</strong> Ilustraciones, gráficos,
            modelos 3D y otros activos creativos.
          </li>
          <li>
            <strong>Música y audio:</strong> Bandas sonoras, efectos de sonido y
            música creada por productores independientes.
          </li>
          <li>
            <strong>E-books y publicaciones digitales:</strong> Libros
            electrónicos, revistas, guías y otros contenidos escritos.
          </li>
          <li>
            <strong>Moneda virtual:</strong> Monedas para juegos y plataformas
            basadas en blockchain.
          </li>
        </ul>
        <p className="text-gray-700">
          Si el artículo está en formato digital y se distribuye mediante
          claves, es elegible para la venta en GudfyP2P. Para más información,
          contacta al soporte comercial.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Qué pasa si el producto que deseo vender no está en el catálogo?
        </h3>
        <p className="text-gray-700 mb-4">
          Si no encuentras el producto que deseas vender, puedes solicitar que
          sea añadido al catálogo. Sigue estos pasos:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Haz clic en "Solicitar producto" en la sección de tu tienda.</li>
          <li>
            Completa el formulario con los detalles del producto (nombre,
            categoría, descripción, etc.).
          </li>
          <li>
            Envía la solicitud. El equipo de administración revisará tu petición
            y te notificará una vez que el producto sea aprobado para subirlo a
            tu tienda.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Cómo identificar qué productos venden mejor?
        </h3>
        <p className="text-gray-700 mb-4">
          Para elegir productos exitosos, mantente informado sobre las
          tendencias del mercado:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>Eventos clave:</strong> Rebajas de Steam, juegos destacados
            en Xbox Game Pass, lanzamientos recientes en PlayStation o Nintendo.
          </li>
          <li>
            <strong>Fuentes confiables:</strong> IGN, PC Gamer, Polygon, entre
            otras.
          </li>
          <li>
            <strong>Herramientas de análisis:</strong> SteamSpy, estadísticas de
            Steam, y datos sobre juegos más jugados.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Listo para empezar?
        </h3>
        <p className="text-gray-700">
          Explora las oportunidades en GudfyP2P y aprovecha la plataforma para
          maximizar tus ingresos como vendedor de artículos digitales. Si deseas
          aprender cómo crear una oferta, consulta nuestra guía:{" "}
          <a href="#" className="text-blue-500 underline">
            "Cómo crear una oferta digital."
          </a>
        </p>
      </div>
    </div>
  )
}

export default DigitalSellingGuide
