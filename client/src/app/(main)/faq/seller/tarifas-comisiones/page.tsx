import React from "react"

const FeesAndCommissionsGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Tarifas y comisiones
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Cuáles son las tarifas y comisiones en GudfyP2P?
        </h3>
        <p className="text-gray-700 mb-4">
          Actualmente, como parte de nuestra fase inicial, hemos establecido una
          política de comisiones muy accesible. Solo aplicamos una comisión del
          1% por cada retiro que realices de tus ganancias acumuladas en la
          plataforma.
        </p>
        <p className="text-gray-700 mb-4">Beneficios:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Sin tarifas ocultas.</li>
          <li>Comisiones competitivas para maximizar tus ingresos.</li>
        </ul>
        <p className="text-gray-700">
          A medida que nuestra plataforma crezca, notificaremos con anticipación
          cualquier ajuste en las tarifas para garantizar total transparencia
          con nuestros usuarios. ¡Empieza a vender con confianza en GudfyP2P!
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Ingresos y Comisiones
        </h3>
        <p className="text-gray-700">¿Qué tarifas y comisiones se aplican?</p>
        <p className="text-gray-700">
          En GudfyP2P, se cobrará una comisión del 1% por cada compra realizada,
          aplicada al comprador, y un 1% por cada retiro de fondos solicitado
          por los vendedores.
        </p>
      </div>
    </div>
  )
}

export default FeesAndCommissionsGuide
