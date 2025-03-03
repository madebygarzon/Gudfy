import React from "react"

const BecomeSellerGuide = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Cómo convertirme en vendedor
      </h2>
      <p className="text-gray-700 mb-6">
        Si deseas vender en GudfyP2P, sigue estos pasos para registrarte como
        vendedor:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          1. Accede a tu cuenta
        </h3>
        <p className="text-gray-700">
          Inicia sesión en tu cuenta de GudfyP2P. Si no tienes una cuenta, crea
          una nueva fácilmente desde la página de inicio de sesión.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          2. Ve a la sección "Mi tienda"
        </h3>
        <p className="text-gray-700">
          En tu Panel de control, selecciona la opción "Mi tienda". Esto te
          llevará al formulario de registro para vendedores.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          3. Elige tu tipo de vendedor
        </h3>
        <p className="text-gray-700 mb-4">
          Selecciona cómo deseas registrarte:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>Soy comerciante individual:</strong> Para personas que
            venden productos como individuos.
          </li>
          <li>
            <strong>Represento una empresa:</strong> Para empresas que desean
            vender a través de GudfyP2P.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          4. Completa el formulario correspondiente
        </h3>
        <p className="text-gray-700 mb-4">
          <strong>Para comerciantes individuales:</strong>
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Proporciona información sobre tu origen de stock, como datos y
            documentos del proveedor.
          </li>
          <li>
            Indica qué tipo de productos venderás y la cantidad aproximada.
          </li>
        </ul>
        <p className="text-gray-700 mb-4">
          <strong>Para empresas:</strong>
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Llena tu información básica, incluyendo nombre, apellidos, correo
            electrónico y teléfono.
          </li>
          <li>
            Proporciona detalles comerciales, como el país, ciudad y otros datos
            generales sobre tu empresa.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          5. Envía tu solicitud
        </h3>
        <p className="text-gray-700">
          Una vez completado el formulario, envíalo. El equipo de GudfyP2P
          revisará tu solicitud lo antes posible.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          6. Comienza a vender
        </h3>
        <p className="text-gray-700">
          Una vez que tu solicitud sea aprobada, podrás listar tus productos y
          comenzar a vender en nuestra plataforma.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Requisitos de verificación del vendedor: preguntas frecuentes
        </h3>
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            ¿Cómo protege GudfyP2P datos sensibles como la información personal?
          </h4>
          <p className="text-gray-700">
            Toda la información recopilada durante el proceso de verificación se
            mantiene confidencial y está protegida conforme a las regulaciones
            del GDPR y otras leyes aplicables. La seguridad es fundamental para
            GudfyP2P, y seguimos las mejores prácticas del mercado en este
            ámbito.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            ¿Por qué GudfyP2P solicita información personal además de documentos
            comerciales?
          </h4>
          <p className="text-gray-700">
            Las regulaciones, como la 4AMLD, requieren que los nuevos vendedores
            proporcionen tanto datos comerciales como personales durante el
            proceso de verificación AML-KYC (Anti-Lavado de Dinero - Conoce a tu
            Cliente). Esto nos permite garantizar que GudfyP2P sea un entorno
            seguro tanto para compradores como para vendedores.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BecomeSellerGuide
