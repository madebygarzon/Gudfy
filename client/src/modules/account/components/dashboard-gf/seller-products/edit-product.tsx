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
} from "@heroui/react"
import FileUploader from "./file-uploader-txt"
import { postAddCodesProduct } from "@modules/account/actions/serial-code/post-add-codes-store-variant"
import { Input } from "@heroui/react"
import ButtonLigth from "@modules/common/components/button_light"
import Thumbnail from "@modules/products/components/thumbnail"
import { postUpdatePriceProduct } from "@modules/account/actions/serial-code/uptade-product-price"

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
  const [updatedPrice, setUpdatedPrice] = useState<string>(productData?.price || '')
  useEffect(() => {
    setError(false)
    setUpdatedPrice(productData?.price || '')
  }, [productData])

  const updatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numeric input with decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setUpdatedPrice(value)
    }
  }

  const onSubmit = () => {
    if (Error) return
    const code = addResult.find(
      (data) => data.variantID === productData.storexvariantid
    )?.codes
    const codes = {
      productvariantid: productData.storexvariantid,
      codes: code,
    }
   if(productData?.price !== updatedPrice){
    const price = {
      productvariantid: productData.storexvariantid,
      price: Number(updatedPrice),
    }
    postUpdatePriceProduct(price).then(() => {
      setReset((reset) => !reset)
      onClose()
    })
   }
   if(code?.length){
    postAddCodesProduct(codes).then(() => {
      setReset((reset) => !reset)
      onClose()
    })
   }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent className="rounded-lg shadow-lg">
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl text-center font-semibold flex flex-col gap-2 pt-6 px-6 sm:px-10">
              Agregar Productos: {productData.productvarianttitle}
            </ModalHeader>
            <ModalBody className="flex overflow-auto py-2 px-6 sm:px-10">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <div className="flex justify-center items-center">
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
                    <p className="mt-2">
                      <span className="font-bold">Precio actual:</span>{" "}
                      ${productData.price}
                    </p>
                    <div className="mt-2">
                      <label htmlFor="price-update" className="font-bold block mb-1">Actualizar precio:</label>
                      <input 
                        id="price-update"
                        type="text" 
                        value={updatedPrice} 
                        onChange={updatePrice}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-[200px]"
                        placeholder="Nuevo precio"
                      />
                    </div>
                  </div>
                  <h4 className="font-bold mt-8 text-lg mb-1">
                    Agregar inventario
                  </h4>
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
              {Error && (
                <p className="text-red-500 text-sm">
                  {"El formato de los codigos es incorrecto"}
                </p>
              )}
              <ButtonLigth
                className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none w-full sm:w-auto"
                onClick={onClose}
              >
                Cancelar
              </ButtonLigth>
              <ButtonLigth
                disabled={(addResult.length === 0 || Error) && updatedPrice === productData.price}
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
