import React from "react"
import LoginComponente from "@modules/account/components/login"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import ButtonLigth from "@modules/common/components/button_light"
import {BsFillArrowLeftCircleFill} from "react-icons/bs"
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ACME account.",
}

export default function Login() {
  
  return (
    <div className="grid grid-cols-2 h-screen ">
      <div className="bg-blue-gf ">
        <div className="flex h-[25%] m-[20px] justify-start items-center pl-9 mb-16">
          <Link href="/">
        <Image
            alt="gudfy"
            src="/header/logo_gudfy.webp"
            width={160}
            height={120}
          />
          </Link>
        </div>
      <div className=" flex items-center justify-center">
        <h1 className="w-[583px] text-[#FFFFFF] font-black text-center text-5xl space-y-4 ">
          {" "}
          <p>¡Hola,</p>
           <p>Nos gusta verte</p>  
         <p>de nuevo!</p> 
        </h1>
      </div>
          <div className="flex justify-center py-14">
          <ButtonLigth className="gap-x-2 text-[#ffffff]" >
          <BsFillArrowLeftCircleFill color="white"/> 
            Inicio
          </ButtonLigth>
          </div>
        <div>
          <p className="pt-8 felx text-[#ffffff] text-center text-[10px]"> <Link href={"/"}>Volver al inicio</Link> | Copyright © 2023 | Powered by Gudfy | <Link href={"https://gudfy.com/terminos-y-condiciones/"}> Términos y condiciones </Link></p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <LoginComponente />
      </div>
    </div>
  )
}
