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
interface CodesResult {
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}

export default function EditProduct({
  productData,
  onOpen,
  isOpen,
  onOpenChange,
  setReset,
  onClose,
}: props) {
  const [Error, setError] = useState<boolean>(false)
  const [addResult, setAddResult] = useState<CodesResult[]>([])
  useEffect(() => {
    setError(false)
  }, [])

  const onSubmit = () => {
    setError(true)
    const code = addResult.find(
      (data) => data.variantID === productData.storexvariantid
    )?.codes
    const codes = {
      productvariantid: productData.storexvariantid,
      codes: code,
    }
    postAddCodesProduct(codes).then(() => {
      setReset((reset) => !reset)
      onClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent className="rounded-lg shadow-lg">
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl text-center font-semibold flex flex-col gap-2 pt-6 px-6 sm:px-10">
              Editar Producto: {productData.productvarianttitle}
            </ModalHeader>
            <ModalBody className="flex overflow-auto py-2 px-6 sm:px-10">
              <div className="flex justify-center items-center">
                <div>
                  <Thumbnail thumbnail={productData.thumbnail} size="small" />
                </div>

                <div className="text-sm text-gray-600">
                  <div className="">
                    <p>
                      <span className="font-bold">Seriales disponibles:</span>{" "}
                      {productData.quantity}
                    </p>
                    <p>
                      <span className="font-bold">Seriales vendidos:</span>{" "}
                      {productData.serialCodeCount}
                    </p>
                  </div>
                  <h4 className="font-bold mt-8 text-lg mb-1">Agregar inventario</h4>
                  <FileUploader
                    setError2={setError}
                    variantID={productData.storexvariantid}
                    setAddResult={setAddResult}
                  />
                </div>
              </div>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4 py-4 px-6 sm:px-10">
              <ButtonLigth
                className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none w-full sm:w-auto"
                onClick={onClose}
              >
                Cancelar
              </ButtonLigth>
              <ButtonLigth
                color="primary"
                className="bg-[#28A745] hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                onClick={onSubmit}
              >
                Guardar
              </ButtonLigth>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
