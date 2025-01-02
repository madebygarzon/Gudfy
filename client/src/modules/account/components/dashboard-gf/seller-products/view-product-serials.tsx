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

  const onSubmit = () => {}

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent className="rounded-lg shadow-lg">
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="text-2xl text-center font-semibold flex flex-col gap-2 pt-6 px-6 sm:px-10">
              {productData.productvarianttitle}
            </ModalHeader>

            {/* Body */}

            <ModalBody className="flex overflow-auto py-2 px-10 ">
              <div className="flex justify-between items-center">
                <div>
                  <Thumbnail thumbnail={productData.thumbnail} size="small" />
                  <div className="text-sm text-gray-600">
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
                </div>

                <div>
                  <div className="overflow-auto  max-h-[400px]">
                    {loading ? (
                      <div className="w-40 h-40">
                        <Loader />
                      </div>
                    ) : (
                      <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            {/* <th className="px-3 py-1 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                          ID
                        </th> */}
                            <th className="px-3 py-1 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                              Serial
                            </th>
                            <th className="px-3 py-1 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                              Disponible
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
                                <td className="px-3 py-2 border-b border-gray-200 text-sm text-gray-700">
                                  {data.serial}
                                </td>
                                <td className="px-3 py-2 border-b border-gray-200 text-sm text-gray-700">
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
            <ModalFooter className=" items-center sm:flex-row  mt-6 gap-4 py-4 px-6 sm:px-10">
              <ButtonLigth
                color="primary"
                className=" text-lila-gf text-lg border-none w-full "
                onClick={onClose}
              >
                <ArrowLeft size={10} />
                Volver
              </ButtonLigth>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
