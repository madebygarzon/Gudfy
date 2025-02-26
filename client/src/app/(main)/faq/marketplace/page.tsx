"use client"
import React, { useEffect, useState } from "react"
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
} from "@nextui-org/react"
import {
  FcPaid,
  FcMoneyTransfer,
  FcReadingEbook,
  FcFaq,
  FcFolder,
  FcKey,
} from "react-icons/fc"
import Link from "next/link"

const icons = [
  { icon: FcPaid, name: "Compra" },
  { icon: FcFolder, name: "Articulos Digitales" },
  { icon: FcKey, name: "Solucion de Problemas" },
  { icon: FcMoneyTransfer, name: "Pagos" },
  { icon: FcFaq, name: "Servicio Gudfy" },
  { icon: FcReadingEbook, name: "Cuentas Gudfy" },
]

const Comprando = [
  {
    question: "¿Cómo comprar?",
    url: "/como-comprar",
  },
  {
    question: "¿Dónde puedo ver mis productos?",
    url: "/donde-ver-productos",
  },
  {
    question: "Pagué y no recibí mis productos",
    url: "/pago-no-recibido",
  },
  {
    question: "Pagué, pero mi pedido no se completó. ¿Qué debo hacer?",
    url: "/pedido-no-completado",
  },
  {
    question: "Políticas de devolución de nuestros vendedores",
    url: "/politicas-devolucion",
  },
  {
    question: "¿Qué métodos de pago puedo utilizar?",
    url: "/metodos-de-pago",
  },
  {
    question: "¿Cómo puedo verificar el estado de mi pedido?",
    url: "/estado-de-pedido",
  },
]

const ProblemasConProductos = [
  {
    question: "El artículo que compré no funciona o dejó de funcionar",
    url: "/articulo-no-funciona",
  },
  {
    question:
      "¿Cómo puedo comunicarme con el vendedor si tengo un problema con mi compra?",
    url: "/comunicacion-vendedor",
  },
  {
    question: "¿Cuándo debería contactar al vendedor?",
    url: "/cuando-contactar-vendedor",
  },
  {
    question:
      "¿Cómo reconocer una actividad fraudulenta o estafa en las conversaciones con vendedores?",
    url: "/reconocer-fraude",
  },
  {
    question:
      "Tengo un problema diferente. ¿Cómo puedo comunicarme con el soporte de GudfyP2P?",
    url: "/contactar-soporte",
  },
]

const Cuenta = [
  {
    question:
      "¿Dónde puedo actualizar los detalles y la configuración de mi cuenta?",
    url: "/actualizar-cuenta",
  },
  {
    question:
      "¿Cómo puedo revisar mis pedidos y obtener mis artículos digitales usando mi panel de control?",
    url: "/revisar-pedidos",
  },
  {
    question: "Olvidé la contraseña de mi cuenta. ¿Cómo puedo restablecerla?",
    url: "/restablecer-contrasena",
  },
]

const OrdersTemplate = () => {
  return (
    <div className="flex flex-col my-10 mx-4 sm:mx-10 w-full">
      <div className="grid grid-cols-4 gap-4 p-4 mb-4">
        {icons.map((data) => {
          const Icon = data.icon

          return (
            <div className="w-full h-[50px] flex items-center ">
              <Icon size={50} />
              <h3>{data.name}</h3>
            </div>
          )
        })}
      </div>

      <h2 className="text-2xl mx-auto mt-2 font-bold text-gray-700 capitalize mb-4">
        Preguntas frecuentes
      </h2>

      <Tabs aria-label="Options ">
        <Tab key="Activaciones" title="Comprando">
          <Card className="pb-0">
            <CardBody className="flex flex-col items-start">
              {Comprando.map((data) => (
                <Link
                  key={data.url}
                  className=" flex w-full h-[60px] py-3 pl-5 items-center border-b-1 border-slate-300"
                  href={"./marketplace" + data.url}
                >
                  <p>{data.question}</p>
                </Link>
              ))}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="Pago" title="Problemas con mis productos">
          <Card className="shadow-lg">
            <CardBody>
              {ProblemasConProductos.map((data, i) => (
                <Link
                  key={data.url}
                  className=" flex w-full h-[60px] py-3 pl-5 items-center border-b-1 border-slate-300"
                  href={data.url}
                >
                  <p>{data.question}</p>
                </Link>
              ))}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="Cuenta" title="Mi cuenta">
          <Card className="shadow-lg">
            <CardBody>
              {Cuenta.map((data, i) => (
                <Link
                  key={data.url}
                  className=" flex w-full h-[60px] py-3 pl-5 items-center border-b-1 border-slate-300"
                  href={data.url}
                >
                  <p>{data.question}</p>
                </Link>
              ))}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}

export default OrdersTemplate
