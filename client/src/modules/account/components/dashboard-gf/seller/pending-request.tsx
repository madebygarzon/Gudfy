import React, { useState } from "react"

const PendingRequest: React.FC = () => (
  <section className="flex items-center justify-center min-h-[60dvh]  w-full px-4">
    <div className="flex flex-col items-center space-y-8 text-center">
      <h1 className="text-3xl md:text-4xl font-black">
        ¡Gracias por aplicar a Gudfys!
      </h1>

      <p className="max-w-xl text-base md:text-lg font-light">
        ¡Gracias por tu interés en convertirte en vendedor en GUDFY! Hemos
        recibido tu solicitud y estamos revisándola cuidadosamente. Por favor,
        ten en cuenta que este proceso puede tardar hasta 3&nbsp;días hábiles.
        ¡Pronto te daremos noticias sobre el estado de tu solicitud! ¡Bienvenido
        a nuestra comunidad!
      </p>
    </div>
  </section>
)

export default PendingRequest
