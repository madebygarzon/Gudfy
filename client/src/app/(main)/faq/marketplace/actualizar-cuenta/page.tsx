import React from "react"

const UpdateAccountInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¿Dónde puedo actualizar los detalles y la configuración de mi cuenta?
      </h2>
      <p className="text-gray-700 mb-6">
        Puedes actualizar la información de tu cuenta y configuraciones de
        manera fácil en GudfyP2P siguiendo estos pasos:
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Accede a tu perfil
        </h3>
        <p className="text-gray-700">
          Inicia sesión en tu cuenta y haz clic en tu nombre o avatar en la
          esquina superior derecha de la pantalla. Luego selecciona la opción
          "Perfil".
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Opciones disponibles
        </h3>
        <p className="text-gray-700 mb-4">En la sección de Perfil, podrás:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Editar tu nombre.</li>
          <li>Cambiar tu correo electrónico.</li>
          <li>Actualizar tu número de teléfono.</li>
          <li>
            Modificar tu contraseña (por motivos de seguridad, no se muestra
            directamente).
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Guarda los cambios
        </h3>
        <p className="text-gray-700">
          Haz clic en la opción "Editar" al lado de la información que deseas
          cambiar. Una vez realizados los ajustes, asegúrate de guardar los
          cambios para que se actualicen correctamente.
        </p>
      </div>
    </div>
  )
}

export default UpdateAccountInfo
