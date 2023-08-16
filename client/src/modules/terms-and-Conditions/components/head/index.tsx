import React from "react";
import Image from "next/image";


const HeadTC: React.FC = () => {

  return (
    <div>
      <div className="relative h-56 w-full  items-center justify-center">
        <Image
          className="object-cover"
          alt="fondo_gudfy"
          fill
          src="/fondo.webp"
        />
        <div className="absolute inset-0 text-center">
          <h1 className="text-[44px] mt-12 font-black text-white ">
            Términos y condiciones
          </h1>
        </div>
      </div>
    </div>
  )
}

export default HeadTC;

