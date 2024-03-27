import React from "react"
import Register from "@modules/account/components/register"
import { Metadata } from "next"
import Image from "next/image"
import ButtonLigth from "@modules/common/components/button_light"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import Link from "next/link"
import CurrentYear from "@lib/util/current-year"

export const metadata: Metadata = {
  title: "Registratse",
  description: "Registrate en su cuenta gudfy",
}

export default function RegisterPages() {
  return (
    <div className="grid grid-cols-2 h-screen ">
      <div className="bg-blue-gf ">
        <div className="flex h-[25%] m-[20px] justify-start items-center pl-9 mb-16">
          <Link href="/">
            <Image
              className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              alt="gudfy"
              src="/footer/gudfy_logo_2.svg"
              width={251.76}
              height={81.63}
            />
          </Link>
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
          <Link href="/">
            <ButtonLigth className="gap-x-2 text-[#ffffff]">
              <BsFillArrowLeftCircleFill color="white" />
              Inicio
            </ButtonLigth>
          </Link>
        </div>
        <p className="pt-8 felx text-[#ffffff] text-center text-[10px]">
          {" "}
          <Link href={"/"}>Volver al inicio</Link> | Copyright © <CurrentYear /> | Powered
          by Gudfy |{" "}
          <Link href={"/terms-and-conditions"} target="_blank">
            {" "}
            Términos y condiciones{" "}
          </Link>
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Register />
      </div>
    </div>
  )
}
