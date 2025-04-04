"use client"
import React, { useState, useEffect } from "react"
import { Input, Textarea } from "@heroui/react"
import Image from "next/image"
import { addRequestProduct } from "@modules/account/actions/request-product/post-add-request-product"
import { Plus } from "@medusajs/icons"
import InputFile from "@modules/common/components/input-file"
import { XCircleSolid } from "@medusajs/icons"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react"
import { ProductCategory } from "@medusajs/medusa"
import ButtonLigth from "@modules/common/components/button_light"
import { useMeCustomer } from "medusa-react"

type Reset = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}
export type objetOptionVariant = {
  index: number
  titleOption?: string
  titleValueVariant?: Array<string>
}

export type variant = {
  index: number
  typeOpcionVariant?: Array<{
    titleOption?: string
    titleValueVariant?: string
  }>
  prices?: number
  inventory_quantity?: number
}
type index = {
  indexOption: number
  indexVariant: number
}
type productData = {
  product: {
    title: string
    subtitle: string
    description: string
    mid_code: string
  }
  categories: ProductCategory[] | undefined
  optionVariant: objetOptionVariant[]
  variant: variant[]
}
type Errors = {
  productError: string
  categoriesError: string
  optionVariant: string
  optionVariantTitle: string
  optionVariantItem: string
  variant: string
  variant_inventory: string
  variant_prices: string
}
export default function RequestProduct({ setReset }: Reset) {
  const { customer } = useMeCustomer()
  const [file, setFile] = useState<File>()
  const [product, setProduct] = useState({
    title: "",
    subtitle: "",
    description: "",
    mid_code: "",
  })

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [valueVariants, setValueVariant] = useState<string>()
  const [titleValueVariants, setTitleValueVariants] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [Errors, setError] = useState<Errors>({
    productError: "",
    categoriesError: "",
    optionVariant: "",
    optionVariantTitle: "",
    optionVariantItem: "",
    variant: "",
    variant_inventory: "",
    variant_prices: "",
  })
  const handlerTrashVariant = (value: string) => {}
  const handlerControlVariant = (e: any) => {
    if (e.includes(",")) {
      setTitleValueVariants((old) => [...old, e.slice(0, -1)])
      setValueVariant("")
    } else {
      setValueVariant(e)
    }
  }

  useEffect(() => {
    setFile(undefined)
    setLoading(false)
  }, [open])

  const handlerError = () => {
    return false
  }

  const onSubmit = () => {
    setLoading(true)
    if (!file) return setLoading(false)

    const productData = {
      customer_id: customer?.id || " ",
      product_title: product.title,
      description: product.description,
      variants: titleValueVariants.join(", "),
    }

    addRequestProduct(productData, transformImage(file))
      .then(() => {
        onOpenChange()
        setReset((boolean) => !boolean)
      })
      .catch(() => {
        alert("algo salio mal")
        setLoading(false)
      })
  }

  const transformImage = (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    return formData
  }

  return (
    <>
      <ButtonLigth
        className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
        onClick={onOpen}
      >
        Solicitar producto
        <Plus />
      </ButtonLigth>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className=""></ModalHeader>
              <ModalBody className="flex justify-center items-center ">
                <div className="gap-x-10 flex flex-col w-full h-screen">
                  <div className="flex py-2 px-4 sm:px-10 md:px-20 lg:px-40 justify-center items-center overflow-y-auto h-full">
                    <div className="rounded-lg shadow-2xl p-4 sm:p-8 flex flex-col md:flex-row w-full gap-4 sm:gap-2  mb-8 ">
                      <div className="flex flex-col w-full md:w-[50%] gap-y-5">
                        <h2 className="md:text-2xl md:mt-2 font-bold text-gray-700 text-lg mt-10">
                          Solicitar un producto
                        </h2>
                        <div>
                          <h3 className="md:text-base font-blod text-sm">
                            Agrega un titulo sin variaciones, Ejemplo: Netflix
                            Colombia
                          </h3>
                          <Input
                            placeholder=""
                            label="Titulo"
                            size="sm"
                            value={product.title}
                            onChange={(e) => {
                              setProduct({ ...product, title: e.target.value })
                            }}
                            required
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-blod">
                            ¿De qué se trata este producto?
                          </h3>
                          <Textarea
                            placeholder="Descripcion del producto"
                            value={product.description}
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-blod">
                            Presiona "," para agregar una variación
                          </h3>

                          <Input
                            labelPlacement="outside"
                            label={``}
                            size="sm"
                            placeholder="Netflix 1 Mes , 3 Meses"
                            value={valueVariants}
                            onChange={(e) =>
                              handlerControlVariant(e.target.value)
                            }
                            startContent={
                              titleValueVariants.length ? (
                                titleValueVariants?.map((v: string) => (
                                  <button
                                    className="mx-1 px-2 py-1 rounded-[10px] bg-slate-300 w-auto"
                                    onClick={() => handlerTrashVariant(v)}
                                  >
                                    <span className="flex gap-1 text-xs items-center">
                                      {" "}
                                      {v} <XCircleSolid />{" "}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <></>
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-[50%] flex justify-between flex-col items-center">
                        <div className="mt-4 sm:mt-14 flex flex-col items-center">
                          <h3 className="text-base font-blod">
                            Imagen del producto
                          </h3>
                          {!file && (
                            <Image
                              alt="ImagePreview"
                              src="/product/image_default.svg"
                              width={100}
                              height={100}
                              className="w-full md:max-w-[200px]  max-w-[100px] rounded-lg"
                            />
                          )}
                          <InputFile
                            type="Normal"
                            label="Subir imagen"
                            setFile={setFile}
                            alt={""}
                            accept="image/*"
                          />
                        </div>
                        <div className="flex gap-4 mt-4">
                          <ButtonLigth
                            className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                            onClick={onClose}
                          >
                            Cancelar
                          </ButtonLigth>
                          <ButtonLigth
                            className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                            onClick={onSubmit}
                            isLoading={loading}
                          >
                            Enviar solicitud
                          </ButtonLigth>
                        </div>
                      </div>
                    </div>

                    {Errors.productError && (
                      <p className="text-red-600">{Errors.productError}</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="mb-6 flex justify-center"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
