import React, { useState } from "react"

const PendingRequest: React.FC = ({}) => {
  return (
    <>
      <div className=" flex flex-col w-full space-y-10 items-center">
        <h1 className="text-center text-[38px] font-black">
          ¡ Gracias por aplicar a Gudfy !
        </h1>

        <p className=" text-center text-[18px] font-light max-w-[700px]">
          ¡Gracias por tu interés en convertirte en vendedor en GUDFY! Hemos
          recibido tu solicitud y estamos revisándola cuidadosamente. Por favor,
          ten en cuenta que este proceso puede tardar hasta 3 días hábiles.
          ¡Pronto te daremos noticias sobre el estado de tu solicitud!
          ¡Bienvenido a nuestra comunidad!
        </p>
      </div>
    </>
  )
}

export default PendingRequest
