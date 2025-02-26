import React from "react"

const ReturnPolicyInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Política de Devoluciones en GudfyP2P
      </h2>
      <p className="text-gray-700 mb-4">
        La política de devoluciones en GudfyP2P depende estrictamente de cada
        uno de nuestros vendedores. GudfyP2P es un marketplace, por lo que no
        vendemos directamente ningún producto.
      </p>
      <p className="text-gray-700 mb-4">
        Para más información, revisa los Términos y Condiciones de cada
        vendedor:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          Al visualizar una oferta en GudfyP2P, haz clic en el nombre del
          vendedor y luego en "Tienda del vendedor".
        </li>
        <li>
          Una vez dentro, selecciona la pestaña "Términos y condiciones" para
          conocer las políticas del vendedor sobre devoluciones.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        Si tienes preguntas adicionales, siempre puedes contactar directamente
        al vendedor a través de la pestaña Conversaciones en nuestra plataforma.
      </p>
      <p className="text-gray-700">
        Para más detalles, consulta nuestra guía sobre cómo contactar con los
        vendedores en GudfyP2P.
      </p>
    </div>
  )
}

export default ReturnPolicyInfo
