import React from "react"
import Register from "@modules/account/components/register"
import { Metadata } from "next"
import Image from "next/image"
import ButtonLigth from "@modules/common/components/button_light"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ACME account.",
}

export default function RegisterPages() {
  return (
    <div className="grid grid-cols-2 h-screen ">
      <div className="bg-blue-gf ">
        <div className="flex h-[25%] m-[20px] justify-start items-center pl-9 mb-16">
          <Image
            alt="gudfy"
            src="/header/logo_gudfy.webp"
            width={160}
            height={120}
          />
        </div>
        <div className=" flex items-center justify-center">
          <h1 className="w-[583px] text-[#FFFFFF] font-black text-center text-5xl space-y-4 ">
            {" "}
            <p>¡Haz parte</p>
            <p>de la comunidad</p>
            <p>Gudfy! </p>
          </h1>
        </div>
        <div className="flex justify-center py-14">
          <ButtonLigth className="gap-x-2 text-[#ffffff]">
            <BsFillArrowLeftCircleFill color="white" />
            Inicio
          </ButtonLigth>
        </div>
        <p className="pt-8 felx text-[#ffffff] text-center text-[10px]">
          Volver al inicio | Copyright © 2023 | Powered by Gudfy | Términos y
          condiciones{" "}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Register />
      </div>
    </div>
  ) 
}
