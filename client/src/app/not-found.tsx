import { Metadata } from "next"
import Link from "next/link"
import ButtonLigth from "@modules/common/components/button_light"
import Image from "next/image"
import ArrowLeft from "@modules/common/icons/arrow-left"

export const metadata: Metadata = {
  title: "404",
  description: "Algo no salió bien",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <Image
                className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                alt="gudfy"
                src="/favicon.ico"
                width={60}
                height={60}
              />
            </Link>

            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              404
            </h1>
          </div>
          <p className="text-xl text-gray-500">Oops! Pagina no encontrada.</p>
          <p className="text-base text-gray-400">
            La pagina que buscas no existe o fue movida.
          </p>
        </div>
        <div className="mt-8">
          <ButtonLigth className="inline-flex items-center">
            <Link className="flex items-center" href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <p className="ml-2">Regresar al inicio</p>
            </Link>
          </ButtonLigth>
        </div>
      </div>
    </div>
  )
}
