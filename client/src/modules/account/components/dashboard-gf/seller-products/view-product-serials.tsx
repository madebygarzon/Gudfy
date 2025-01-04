"use client"
import React, { useState, useEffect } from "react"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import FileUploader from "./file-uploader-txt"
import { postAddCodesProduct } from "@modules/account/actions/serial-code/post-add-codes-store-variant"
import ButtonLigth from "@modules/common/components/button_light"
import Thumbnail from "@modules/products/components/thumbnail"
import { getListProductSerials } from "@modules/account/actions/serial-code/get-seller-product-serials"
import ArrowLeft from "@modules/common/icons/arrow-left"
import Loader from "@lib/loader"
import { DownloadIcon } from "@lib/util/icons"
import { Snippet } from "@nextui-org/react"

type props = {
  productData: StoreProducVariant
  onOpenChange: () => void
  onOpen: () => void
  isOpen: boolean
  setReset: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
}
type StoreProducVariant = {
  description: string
  thumbnail: string
  productid: string
  producttitle: string
  productvariantid: string
  storeid: string
  storexvariantid: string
  variantid: string
  productvarianttitle: string
  quantity: string
  price: string
  serialCodeCount: number
}
interface serials {
  id: string
  serial: string
  store_variant_order_id: boolean
}

export default function ViewProductSerials({
  productData,
  onOpen,
  isOpen,
  onOpenChange,
  setReset,
  onClose,
}: props) {
  const [Error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [Serials, setSerials] = useState<serials[]>([])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      getListProductSerials(productData.storexvariantid).then((e) => {
        setSerials(e)
        setLoading(false)
      })
    }
  }, [isOpen])

  const handleDownloadSerials = () => {
    const serialData = Serials.map(
      (serial) =>
        `${serial.serial},${
          serial.store_variant_order_id ? "Vendido" : "Disponible"
        }`
    ).join("\n")
    const blob = new Blob([serialData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${productData.productvarianttitle}_serials.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const onSubmit = () => {}

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent className="rounded-lg shadow-lg">
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="text-2xl mt-2 font-bold text-gray-700 text-center flex flex-col gap-2 pt-6 px-6 sm:px-10">
              Inventario para: {productData.productvarianttitle}
              <div className="text-sm text-gray-600">
                <div className="">
                  <p>
                    <span className="font-bold">Códigos disponibles:</span>{" "}
                    {productData.quantity}
                  </p>
                  <p>
                    <span className="font-bold">Códigos vendidos:</span>{" "}
                    {productData.serialCodeCount}
                  </p>
                </div>
              </div>
            </ModalHeader>

            {/* Body */}

            <ModalBody className="flex overflow-auto py-2 px-10 ">
              <div className="items-center">
                {/* <div> */}
                {/* <Thumbnail thumbnail={productData.thumbnail} size="small" /> */}
                {/* <div className="text-sm text-gray-600">
                    <div className="">
                      <p>
                        <span className="font-bold">
                          Códigos en inventario:
                        </span>{" "}
                        {productData.quantity}
                      </p>
                      <p>
                        <span className="font-bold">Códigos vendidos:</span>{" "}
                        {productData.serialCodeCount}
                      </p>
                    </div>
                  </div>
                </div> */}

                <div>
                  <div className="mx-10 rounded-lg shadow-2xl  overflow-y-auto  max-h-[400px]">
                    {loading ? (
                      <div className="flex items-center justify-center w-40 h-40">
                        <Loader />
                      </div>
                    ) : (
                      <table className="bg-white mx-4">
                        <thead className="sticky top-0 bg-white p-8 z-30">
                          <tr className="bg-white z-10">
                            {/* <th className="px-3 py-1 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                          ID
                        </th> */}
                            <th className="pl-6 py-8 border-b border-gray-200 text-left">
                              Serial
                            </th>
                            <th className="pl-4 py-8 border-b border-gray-200 text-left">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Serials.length ? (
                            Serials.map((data) => (
                              <tr key={data.id} className="hover:bg-gray-50">
                                {/* <td className="px-3 py-2 border-b border-gray-200 text-sm text-gray-700">
                              {data.id}
                            </td> */}
                                <td className="w-full px-3 py-2  text-sm text-gray-700">
                                  <Snippet>{data.serial}</Snippet>
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-700">
                                  {data.store_variant_order_id
                                    ? "Vendido"
                                    : "Disponible"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex justify-center items-center sm:flex-row  mt-6 gap-4 py-4 px-6 sm:px-10">
              <ButtonLigth
                color="primary"
                className="bg-[#28A745] hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                onClick={onClose}
              >
                Cerrar
              </ButtonLigth>

              <ButtonLigth
                color="primary"
                className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none w-full sm:w-auto gap-2"
                onClick={handleDownloadSerials}
              >
                <DownloadIcon />
                Descargar todos
              </ButtonLigth>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
