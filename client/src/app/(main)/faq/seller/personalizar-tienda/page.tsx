import React from "react"

const CustomizeStoreGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Cómo personalizar tu tienda?
      </h2>
      <p className="text-gray-700 mb-6">
        En GudfyP2P, puedes personalizar tu tienda para que refleje tu estilo y
        se adapte mejor a tus necesidades. Sigue estos pasos para configurarla:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Accede a la sección "Mi Tienda"
        </h3>
        <p className="text-gray-700">
          En tu Panel de control, selecciona la opción "Mi Tienda". Desde ahí,
          podrás gestionar todas las opciones de personalización.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Personaliza el nombre y avatar de tu tienda
        </h3>
        <p className="text-gray-700 mb-4">Cambia el nombre de tu tienda:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Selecciona un adjetivo y un animal para formar el nombre de tu
            tienda.
          </li>
          <li>
            Ten en cuenta que solo podrás modificar el nombre una única vez, así
            que elige con cuidado.
          </li>
          <li>Haz clic en "Guardar" para confirmar los cambios.</li>
        </ul>
        <p className="text-gray-700">Selecciona un avatar:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Elige una imagen que represente tu tienda de las opciones
            disponibles. Esto ayudará a que tu tienda tenga una identidad visual
            única.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Agrega información sobre tu tienda
        </h3>
        <p className="text-gray-700 mb-4">
          Incluye una breve descripción sobre quién eres y qué vendes. Esto
          ayudará a tus clientes a conocerte mejor.
        </p>
        <p className="text-gray-700">
          Define las políticas de tu tienda, como políticas de reembolso,
          garantía y atención al cliente, para que los compradores sepan qué
          esperar.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Administra productos y órdenes
        </h3>
        <p className="text-gray-700 mb-4">
          Desde esta sección, también puedes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Gestionar tus productos: Agrega, edita y elimina los artículos que
            ofreces.
          </li>
          <li>
            Revisar tus órdenes: Consulta las ventas y el estado de tus pedidos
            en curso.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. Administra tus ingresos
        </h3>
        <p className="text-gray-700">
          Utiliza la opción "Tu Billetera" para llevar un control de tus
          ingresos y gestionar retiros fácilmente.
        </p>
      </div>
    </div>
  )
}

export default CustomizeStoreGuide
