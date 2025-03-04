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
  FcClapperboard,
  FcVideoFile,
  FcMoneyTransfer,
  FcCapacitor,
  FcPositiveDynamic,
  FcStackOfPhotos,
  FcTreeStructure,
  FcKindle,
} from "react-icons/fc"
import Link from "next/link"

const icons = [
  { icon: FcClapperboard, name: "Comenzando" },
  { icon: FcVideoFile, name: "Venta Digital" },
  { icon: FcMoneyTransfer, name: "Ingresos y tarigfas" },
  { icon: FcMoneyTransfer, name: "Servicio y calificación" },
  { icon: FcPositiveDynamic, name: "Creciendo tu negocio" },
  { icon: FcCapacitor, name: "Api Gudfy" },
  { icon: FcStackOfPhotos, name: "Anuncios Gudfy" },
  { icon: FcTreeStructure, name: "Resolviendo Problemas" },
  { icon: FcKindle, name: "Para Desarrolladores" },
]

const Vendedores = [
  {
    question: "¿Cómo convertirme en vendedor?",
    url: "./convertirse-en-vendedor",
  },
  {
    question: "Requisitos de verificación del vendedor: preguntas frecuentes",
    url: "./verificacion-vendedor",
  },
  {
    question: "¿Cómo personalizar tu tienda?",
    url: "./personalizar-tienda",
  },
  {
    question:
      "¿Cómo puedo consultar y gestionar las notificaciones de venta a través de mi panel de control?",
    url: "./notificaciones-venta",
  },
]

const OfertasYProductos = [
  {
    question: "¿Cómo crear una oferta?",
    url: "./crear-oferta",
  },
  {
    question: "¿Cómo agregar códigos en una oferta?",
    url: "./agregar-codigos-oferta",
  },
  {
    question: "¿El producto que quieres vender no está en nuestra lista?",
    url: "./solicitar-producto",
  },
  {
    question:
      "¿Cómo puedo gestionar los artículos digitales que ya estoy vendiendo a través de la pestaña 'productos'?",
    url: "#",
  },
  {
    question: "¿Qué significa el estado de mi oferta?",
    url: "#",
  },
  {
    question: "Guía completa para vender artículos digitales",
    url: "./guia-vender-digitales",
  },
]

const Finanzas = [
  {
    question: "¿Qué tarifas y comisiones se aplican?",
    url: "./tarifas-comisiones",
  },
  {
    question: "¿Cómo puedo retirar mi dinero?",
    url: "./retirar-dinero",
  },
  {
    question: "Diferencia entre saldo total y saldo disponible",
    url: "./diferencia-saldo",
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
        Preguntas frecuentes vendedor
      </h2>

      <Tabs aria-label="Options ">
        <Tab key="Activaciones" title="Cómo comenzar a vender">
          <Card className="pb-0">
            <CardBody className="flex flex-col items-start">
              {Vendedores.map((data) => (
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

        <Tab key="Pago" title="Crear y gestionar ofertas">
          <Card className="shadow-lg">
            <CardBody>
              {OfertasYProductos.map((data, i) => (
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

        <Tab key="Cuenta" title="Ingresos y comisiones">
          <Card className="shadow-lg">
            <CardBody>
              {Finanzas.map((data) => (
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
