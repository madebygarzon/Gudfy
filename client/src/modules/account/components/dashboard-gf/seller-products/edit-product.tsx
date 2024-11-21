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
  const [edit, setEdet] = useState<boolean>()
  const [addResult, setAddResult] = useState<CodesResult[]>([])
  useEffect(() => {
    setEdet(false)
  }, [])

  const onSubmit = () => {
    setEdet(true)
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
            <ModalHeader className="flex flex-col gap-1 px-40">
              Editar Producto: {productData.productvarianttitle}
              <div className="text-xs ">
                <p>Codigos en inventario: {productData.quantity} </p>
                <p>Codigos vendidos: {productData.serialCodeCount}</p>
              </div>
            </ModalHeader>
            <ModalBody className="flex overflow-auto py-10 px-40">
              <h4 className="font-bold">Subir nuevos productos</h4>
              <FileUploader
                variantID={productData.storexvariantid}
                setAddResult={setAddResult}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" isDisabled={edit} onPress={onSubmit}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
