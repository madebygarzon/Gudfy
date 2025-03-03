import React from "react"

const SellerVerificationFAQ = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Requisitos de verificación del vendedor: preguntas frecuentes
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. ¿Por qué GudfyP2P solicita información sobre el origen del stock?
        </h3>
        <p className="text-gray-700">
          En GudfyP2P, pedimos esta información para asegurarnos de que las
          ventas sean legítimas y libres de fraude. Al proporcionar detalles
          sobre el origen del stock y los proveedores, garantizamos que los
          productos ofrecidos en la plataforma provienen de fuentes verificadas
          y confiables.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. ¿Qué tipo de información sobre el proveedor necesito proporcionar?
        </h3>
        <p className="text-gray-700 mb-4">
          Debes proporcionar los siguientes datos sobre tu proveedor:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Nombre del proveedor.</li>
          <li>Tipo de proveedor (mayorista, fabricante, etc.).</li>
          <li>Nombre de la empresa proveedora (si aplica).</li>
          <li>País, ciudad y dirección del proveedor.</li>
        </ul>
        <p className="text-gray-700">
          Además, deberás subir documentos del proveedor, como facturas,
          contratos o cualquier evidencia que valide su legitimidad.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. ¿Por qué debo incluir un comprobante de domicilio en mi solicitud?
        </h3>
        <p className="text-gray-700">
          El comprobante de domicilio nos permite verificar que el proveedor y
          tú cuentan con una ubicación física real. Esto es esencial para
          garantizar que la plataforma solo incluya vendedores auténticos y
          confiables, lo que protege tanto a los compradores como a otros
          vendedores.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. ¿Qué documentos aceptan como comprobante de domicilio?
        </h3>
        <p className="text-gray-700 mb-4">
          Aceptamos los siguientes documentos como comprobante de domicilio:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Recibos de servicios públicos (luz, agua, gas, internet) con menos
            de tres meses de antigüedad.
          </li>
          <li>Extractos bancarios.</li>
          <li>Contratos de alquiler o escrituras de propiedad.</li>
        </ul>
        <p className="text-gray-700">
          El documento debe incluir tu nombre completo y dirección.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. ¿Qué pasa si no tengo un proveedor, pero soy el creador de mis
          productos?
        </h3>
        <p className="text-gray-700">
          Si eres el fabricante o creador de tus productos, deberás proporcionar
          una explicación clara sobre el proceso de creación y validación de tus
          productos, así como evidencias que respalden la calidad y originalidad
          de los mismos.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          6. ¿Por qué solicitan ejemplos de productos y enlaces a otras
          plataformas?
        </h3>
        <p className="text-gray-700">
          Solicitamos ejemplos de productos para verificar la naturaleza de lo
          que venderás y asegurarnos de que cumpla con las políticas de
          GudfyP2P. Los enlaces a otras plataformas donde distribuyes tu stock
          nos ayudan a confirmar la autenticidad de tus operaciones y a validar
          tu experiencia como vendedor.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          7. ¿Qué sucede si no puedo proporcionar toda la información requerida?
        </h3>
        <p className="text-gray-700">
          Si tienes dificultades para proporcionar alguno de los requisitos,
          comunícate con nuestro equipo de soporte. Evaluaremos tu caso y te
          guiaremos sobre cómo proceder.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          8. ¿Qué medidas de seguridad toman para proteger la información que
          proporciono?
        </h3>
        <p className="text-gray-700">
          En GudfyP2P, cumplimos con regulaciones internacionales, como el GDPR,
          para proteger toda la información que nos proporcionas. Tus datos son
          tratados de manera confidencial y solo se utilizan para el proceso de
          verificación.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          9. ¿Cuánto tiempo tarda la revisión de mi solicitud?
        </h3>
        <p className="text-gray-700">
          El tiempo de revisión puede variar según la cantidad de solicitudes
          recibidas. En promedio, tardamos entre 3 y 5 días hábiles en verificar
          tu información y contactarte con los resultados.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          10. ¿Puedo actualizar mi información después de que mi cuenta sea
          aprobada?
        </h3>
        <p className="text-gray-700">
          Sí, podrás actualizar algunos datos desde tu Panel de control, como la
          información sobre tus productos o proveedores. Sin embargo, cambios
          importantes, como el origen del stock o datos comerciales, pueden
          requerir una nueva verificación.
        </p>
      </div>
    </div>
  )
}

export default SellerVerificationFAQ
