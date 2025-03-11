import React from "react"
import Link from "next/link"

const ForgotPasswordInfo = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Restablecer Contraseña
      </h2>
      <p className="text-gray-700 mb-6">
        Si olvidaste tu contraseña, puedes restablecerla fácilmente siguiendo
        estos pasos:
      </p>

      {/* Paso 1 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">1. Accede a la página de inicio de sesión</h3>
        <p className="text-gray-700">
          Ve a la página de inicio de sesión de{" "}
          <Link href="/login" className="text-blue-600 underline">
            GudfyP2P
          </Link>{" "}
          y haz clic en{" "}
          <span className="font-semibold">"¿Has olvidado la contraseña?"</span>.
        </p>
      </div>

      {/* Paso 2 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">2. Ingresa tu correo electrónico</h3>
        <p className="text-gray-700">
          Introduce la dirección de correo electrónico asociada a tu cuenta y haz
          clic en el botón{" "}
          <span className="font-semibold">"Enviar"</span>.
        </p>
      </div>

      {/* Paso 3 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">3. Revisa tu bandeja de entrada</h3>
        <p className="text-gray-700">
          Recibirás un correo electrónico con un enlace para restablecer tu
          contraseña. Si no lo encuentras, revisa también tu carpeta de{" "}
          <span className="font-semibold">spam</span> o{" "}
          <span className="font-semibold">correo no deseado</span>.
        </p>
      </div>

      {/* Paso 4 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">4. Crea una nueva contraseña</h3>
        <p className="text-gray-700">
          Haz clic en el enlace del correo, ingresa una nueva contraseña y
          confírmala. Luego, guarda los cambios.
        </p>
      </div>

      {/* Paso 5 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">5. Inicia sesión con tu nueva contraseña</h3>
        <p className="text-gray-700">
          Una vez restablecida, utiliza tu nueva contraseña para acceder a tu
          cuenta.
        </p>
      </div>

      {/* Nota */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2">Nota:</h3>
        <p className="text-gray-700">
          Si no recibes el correo de restablecimiento o tienes problemas para
          acceder a tu cuenta, contacta a nuestro equipo de soporte para obtener
          ayuda adicional.
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordInfo