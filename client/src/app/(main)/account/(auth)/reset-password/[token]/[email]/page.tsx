import React from "react"
import ResetPassword from "@modules/account/components/recover-account/reset-password"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import ButtonLigth from "@modules/common/components/button_light"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en Gudfy.",
}

export default async function Login({
  params: { token, email },
}: {
  params: { token: string; email: string }
}) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 min-h-screen">
      {/* Left side - Blue section */}
      <div className="bg-blue-gf py-6 md:py-0 order-2 md:order-1">
        {/* Logo */}
        <div className="flex justify-center md:justify-start md:h-[25%] md:m-[20px] md:pl-9 md:mb-16 mb-6">
          <Link href="/">
            <Image
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              alt="gudfy"
              src="/footer/gudfy_logo_2.svg"
              width={200}
              height={65}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
              }}
            />
          </Link>
        </div>
        
        {/* Main heading */}
        <div className="flex items-center justify-center">
          <h1 className="text-[#FFFFFF] font-black text-center text-3xl md:text-4xl lg:text-5xl space-y-2 md:space-y-4 max-w-[90%] md:max-w-[583px]">
            <p>!EN GUDFY,</p>
            <p>SIEMPRE PENSAMOS</p>
            <p>EN TI!</p>
          </h1>
        </div>
        
        {/* Button */}
        <div className="flex justify-center py-8 md:py-14">
          <ButtonLigth className="gap-x-2 text-[#ffffff]">
            <BsFillArrowLeftCircleFill color="white" />
            Inicio
          </ButtonLigth>
        </div>
        
        {/* Footer */}
        <div className="mt-4 md:mt-0">
          <p className="pt-4 md:pt-8 text-[#ffffff] text-center text-[10px] px-4">
            <Link href={"/"} className="hover:underline">Volver al inicio</Link> | Copyright © {new Date().getFullYear()} |
            Powered by Gudfy |{" "}
            <Link href={"/terms-and-conditions"} target="_blank" className="hover:underline">
              Términos y condiciones
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex items-center justify-center p-4 md:p-8 order-1 md:order-2">
        <ResetPassword token={token} email={email} />
      </div>
    </div>
  )
}
