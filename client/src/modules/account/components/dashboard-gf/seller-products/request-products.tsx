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
    description: string
  }
  categories: ProductCategory[] | undefined
  optionVariant: objetOptionVariant[]
  variant: variant[]
}
type Errors = {
  title: string
  description: string
  variants: string
  image: string
}
export default function RequestProduct({ setReset }: Reset) {
  const { customer } = useMeCustomer()
  const [file, setFile] = useState<File>()
  const [product, setProduct] = useState({
    title: "",
    description: "",
  })

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [variantInputs, setVariantInputs] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [Errors, setError] = useState<Errors>({
    title: "",
    description: "",
    variants: "",
    image: "",
  })

  const addVariant = () => {
    setVariantInputs([...variantInputs, ""])
  }

  const removeVariant = (index: number) => {
    const newVariants = [...variantInputs]
    newVariants.splice(index, 1)
    setVariantInputs(newVariants)
  }

  const handleUpdateVariant = (index: number, value: string) => {
    const newVariants = [...variantInputs]
    newVariants[index] = value
    setVariantInputs(newVariants)
  }

  useEffect(() => {
    setFile(undefined)
    setVariantInputs([])
    setLoading(false)
    setProduct({
      title: "",
      description: "",
    })
    setError({
      title: "",
      description: "",
      variants: "",
      image: "",
    })
  }, [isOpen])

  const handlerError = () => {
    return false
  }

  const onSubmit = () => {
    setLoading(true)

    const newErrors: Errors = {
      title: "",
      description: "",
      variants: "",
      image: "",
    }

    if (!product.title.trim()) newErrors.title = "El título es requerido."
    if (!product.description.trim())
      newErrors.description = "La descripción es requerida."
    if (variantInputs.filter((v) => v.trim() !== "").length === 0)
      newErrors.variants = "Debe agregar al menos una variación."
    if (!file) newErrors.image = "La imagen del producto es requerida."

    if (Object.values(newErrors).some(Boolean)) {
      setError(newErrors)
      setLoading(false)
      return
    }
    setLoading(true)
    if (!file) return setLoading(false)

    const variantsString =
      variantInputs.length > 0
        ? variantInputs.filter((v) => v.trim() !== "").join(", ")
        : ""

    const productData = {
      customer_id: customer?.id || " ",
      product_title: product.title,
      description: product.description,
      variants: variantsString,
    }

    addRequestProduct(productData, transformImage(file!))
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
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold">
                              Variaciones del producto
                            </h3>
                            <ButtonLigth
                              className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none py-1 px-2 text-xs"
                              onClick={addVariant}
                            >
                              <span className="mr-1">+ Añadir variante</span>
                            </ButtonLigth>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {variantInputs.map((variant, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  size="sm"
                                  placeholder="Ej: Netflix 1 Mes"
                                  value={variant}
                                  onChange={(e) =>
                                    handleUpdateVariant(index, e.target.value)
                                  }
                                  className="flex-grow"
                                />
                                <button
                                  onClick={() => removeVariant(index)}
                                  className="flex items-center justify-center h-9 w-9 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                  <XCircleSolid />
                                </button>
                              </div>
                            ))}
                          </div>
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
                        {Object.values(Errors).some(Boolean) && (
                          <p className="text-red-600 mt-4">
                            {Object.values(Errors).find(Boolean)}
                          </p>
                        )}
                      </div>
                    </div>
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
