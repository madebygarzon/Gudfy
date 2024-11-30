"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Accordion, AccordionItem, Snippet } from "@nextui-org/react"
import { FaEye } from "react-icons/fa6"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import { getListSerialCode } from "@modules/account/actions/serial-code/get-list-serial-code"
import Image from "next/image"
import Loader from "@lib/loader"

type SerialCodes = {
  store_variant_order: string
  quantity: number
  order_number: string
  store_name: string
  product_name: string
  thumbnail: string
  serial_codes: string[]
}

const SerialCodeTable: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [listSerialCodes, setListSerialCodes] = useState<SerialCodes[]>()
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  }

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }

  const handlerGetListSerialCodes = () => {
    getListSerialCode().then((e) => {
      setListSerialCodes(e)
      setLoading(false)
    })
  }

  useEffect(() => {
    handlerGetListSerialCodes()
  }, [])

  return (
    <div className="w-full p-6">
      <div className="mb-8 flex flex-col gap-y-4 ">
        <h1 className="text-2xl-semi">Mis Ordenes</h1>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2  bg-gray-100 text-left">Producto</th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Numero orden
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Nombre de la tienda
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">Cantidad</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Codigos</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                listSerialCodes?.map((code, i) => (
                  <tr
                    key={code.store_variant_order}
                    className="hover:bg-gray-50"
                  >
                    <td className=" py-2 flex items-center justify-center">
                      <Image
                        src={code.thumbnail}
                        alt={code.product_name}
                        height={150}
                        width={100}
                      />
                      <p className="text-red-600">{code.product_name}</p>
                    </td>
                    <td className="px-4 py-2 ">
                      {handlerOrderNumber(code.order_number)}
                    </td>
                    <td className="px-4 py-2 ">{code.store_name}</td>
                    <td>{code.quantity}</td>
                    <td className="px-4 py-2  text-center">
                      <Accordion
                        showDivider={false}
                        className="p-2 flex flex-col gap-1 w-full max-w-[300px]"
                        variant="shadow"
                        itemClasses={itemClasses}
                      >
                        <AccordionItem
                          key={i}
                          aria-label="Connected devices"
                          startContent={<FaEye className="text-primary" />}
                          subtitle={
                            <p className="flex">
                              2 issues to{" "}
                              <span className="text-primary ml-1">fix now</span>
                            </p>
                          }
                          title="Connected devices"
                        >
                          {code.serial_codes.map((code) => (
                            <Snippet color="default">{code}</Snippet>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="p-6"><Loader/></div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SerialCodeTable
