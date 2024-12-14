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
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl flex flex-col gap-1 px-40">
              Editar Producto: {productData.productvarianttitle}
              <div className="text-xs ">
                <p>Codigos en inventario: {productData.quantity} </p>
                <p>Codigos vendidos: {productData.serialCodeCount}</p>
              </div>
            </ModalHeader>
            <ModalBody className="flex overflow-auto py-10 px-40">
              <h4 className="font-bold">Agregar ítems</h4>
              <FileUploader
                setError2={setError}
                variantID={productData.storexvariantid}
                setAddResult={setAddResult}
              />
            </ModalBody>
            <ModalFooter>
              <ButtonLigth className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none" onClick={onClose}>
                Cancelar
              </ButtonLigth>
              <ButtonLigth
                color="primary"
                className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                // isDisabled={!addResult.length || Error}
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
