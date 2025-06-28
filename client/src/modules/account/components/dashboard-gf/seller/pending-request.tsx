import React, { useState } from "react"

const PendingRequest: React.FC = () => (
  <section className="flex items-center justify-center min-h-[60dvh]  w-full px-4">
    <div className="flex flex-col items-center space-y-8 text-center">
      <h1 className="text-3xl md:text-4xl font-black">
        ¡Gracias por unirte a Gudfyp2p!
      </h1>

      <p className="max-w-xl text-base md:text-lg font-light">
        Recibimos tu solicitud para ser vendedor y la estamos revisando.
        En máximo 3&nbsp;días hábiles tendrás una respuesta.
        ¡Bienvenido a nuestra comunidad!
      </p>
    </div>
  </section>
)

export default PendingRequest
