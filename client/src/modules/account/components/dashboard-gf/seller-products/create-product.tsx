"use client"
import React, { useState, useEffect } from "react"
import { Input, Spinner, Textarea } from "@nextui-org/react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { CreateProductInput } from "@modules/account/actions/post-seller-product"
import { Accordion, AccordionItem } from "@nextui-org/react"
import { Minus, Trash, Plus } from "@medusajs/icons"
import { Button as ButtonM, FocusModal, IconButton } from "@medusajs/ui"
import InputFile from "@modules/common/components/input-file"
import { Select, SelectItem, Selection } from "@nextui-org/react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { FiCornerDownRight } from "react-icons/fi"
import getAllCategories from "@modules/account/actions/get-data-categories"
import { ProductCategory } from "@medusajs/medusa"
import ProductOptionVariant from "./product-option-variant"
import ProductVariat from "./product-variatn"

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
export default function CreateProduct({ setReset }: Reset) {
  // const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>()
  const [product, setProduct] = useState({
    title: "",
    subtitle: "",
    description: "",
    mid_code: "",
  })
  const [valuesSelectorCategory, setValuesSelectorCategory] = useState<
    ProductCategory[] | undefined
  >()
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = e.target.value.split(",")
    const newArray = values
      .map((v) => categories?.find((c) => c.name === v))
      .filter(Boolean) as ProductCategory[]
    setValuesSelectorCategory(newArray)
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [index, setIndex] = useState<index>({
    indexOption: 0,
    indexVariant: 0,
  })
  const [categories, setCategories] = useState<ProductCategory[]>()
  const [optionVariant, setOptionVariant] = useState<Array<objetOptionVariant>>(
    []
  )
  const [variant, setVariant] = useState<Array<variant>>([])
  const [numberVariant, setNumberVariant] = useState<number>(0)
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

  const categoriesOrder = () => {
    getAllCategories().then((e) => {
      const newArray: ProductCategory[] = []
      e.product_categories.forEach((cateogry) => {
        if (cateogry.parent_category) return
        newArray.push(cateogry)
        if (cateogry.category_children) {
          cateogry.category_children.forEach((cateChild) => {
            newArray.push(cateChild)
          })
        }
      })
      setCategories(newArray)
    })
  }

  useEffect(() => {
    setFile(null)
    categoriesOrder()
  }, [open])

  const handlerError = () => {
    let error = false
    setError({
      productError: "",
      categoriesError: "",
      optionVariant: "",
      optionVariantTitle: "",
      optionVariantItem: "",
      variant: "",
      variant_inventory: "",
      variant_prices: "",
    })
    if (
      !product.title ||
      !product.mid_code ||
      !product.subtitle ||
      !product.description
    ) {
      error = true
      setError((data) => ({ ...data, productError: "Campos incompletos" }))
    }
    if (!valuesSelectorCategory?.length) {
      error = true
      setError((data) => ({
        ...data,
        categoriesError: "Selecciona una categoria",
      }))
    }
    if (!optionVariant.length) {
      error = true
      setError((data) => ({
        ...data,
        optionVariant: "Agrega las variaciones correspondientes al produto",
      }))
    } else {
      optionVariant.forEach((v, i) => {
        if (!v.titleOption) {
          error = true
          setError((data) => ({
            ...data,
            optionVariantTitle: "Agrega un titulo para la opcion de variacion",
          }))
        }

        if (!v.titleValueVariant?.length) {
          error = true
          setError((data) => ({
            ...data,
            optionVariantItem: "Agrega por lo menos una opcion",
          }))
        }
      })
    }
    if (!variant.length) {
      error = true
      setError((data) => ({ ...data, variant: "Agrega una variacion" }))
    } else {
      variant.forEach((v, i) => {
        if (!v.inventory_quantity) {
          error = true
          setError((data) => ({
            ...data,
            variant_inventory:
              "Inserta la cantidad correspondiente a la variacion",
          }))
        }
        if (!v.prices) {
          error = true
          setError((data) => ({
            ...data,
            variant_prices: "Inserta el precio correspondiente a la variacion",
          }))
        }
      })
    }

    return error
  }
  const handlerNumberVariant = () => {
    // let number = 0
    // optionVariant.forEach((v) => {
    //   number += v.titleValueVariant?.length || 0
    // })
    // console.log("Number", number)
    // setNumberVariant(number)
  }
  const onSubmit = () => {
    if (handlerError()) return
    if (!file) return
    const productData = {
      product,
      categories: valuesSelectorCategory,
      optionVariant,
      variant,
    }

    CreateProductInput(productData, transformImage(file))
      .then(() => {
        onOpenChange()
        setReset((boolean) => !boolean)
      })
      .catch(() => {
        alert("algo salio mal")
      })
  }

  const transformImage = (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    return formData
  }
  const handlerAddOption = () => {
    const objAux: objetOptionVariant = {
      index: index.indexOption,
      titleOption: "",
      titleValueVariant: [],
    }
    setOptionVariant((optionV) =>
      optionV.length ? [...optionV, objAux] : [objAux]
    )
    setIndex((indexOld) => ({
      ...indexOld,
      indexOption: indexOld.indexOption + 1,
    }))
  }
  const handlerAddVariant = () => {
    const objAux: variant = {
      index: index.indexVariant,
      typeOpcionVariant: [],
      prices: 0,
      inventory_quantity: 0,
    }
    setVariant((vari) => (vari.length ? [...vari, objAux] : [objAux]))
    setIndex((indexOld) => ({
      ...indexOld,
      indexVariant: 1 + indexOld.indexVariant,
    }))
  }
  const handlerTrash = (index: number) => {
    setVariant((arry) => {
      const newArray = arry.filter((vari) => vari.index !== index)
      return newArray
    })
  }
  return (
    <>
      <ButtonM
        variant="transparent"
        className=" border rounded-[5px]"
        onClick={onOpen}
      >
        Agregar Producto
        <Plus />
      </ButtonM>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-40">
                Crear Producto
              </ModalHeader>
              <ModalBody className="flex overflow-auto py-10 px-40">
                <Accordion
                  defaultExpandedKeys={["IG"]}
                  selectionMode="multiple"
                  isCompact={true}
                >
                  <AccordionItem
                    key="IG"
                    aria-label="Accordion 1"
                    subtitle="Personalisa tu producto"
                    indicator={({ isOpen }) =>
                      isOpen ? <Minus className="rotate-90" /> : <Plus />
                    }
                    title="Informacion General"
                  >
                    <div className="flex w-full gap-10 ">
                      <div className="flex flex-col w-[50%] gap-y-5 ">
                        <Input
                          placeholder="Tarjeta Netflix"
                          label="Titulo"
                          size="sm"
                          value={product.title}
                          onChange={(e) =>
                            setProduct({ ...product, title: e.target.value })
                          }
                          required
                        />{" "}
                        <Input
                          placeholder="Tarjeta Netflix"
                          label="Subtitulo"
                          size="sm"
                          value={product.subtitle}
                          onChange={(e) =>
                            setProduct({ ...product, subtitle: e.target.value })
                          }
                        />
                        <Input
                          placeholder="AN-154"
                          label="Slug"
                          size="sm"
                          value={product.mid_code}
                          onChange={(e) =>
                            setProduct({ ...product, mid_code: e.target.value })
                          }
                        />
                      </div>
                      <div className="w-[50%] flex flex-col items-center">
                        <h3 className="text-base font-blod ">
                          Imagen Principal
                        </h3>

                        {file ? (
                          <Image
                            alt="ImagePreview"
                            src={URL.createObjectURL(file)}
                            width={100}
                            height={100}
                          />
                        ) : (
                          <Image
                            alt="ImagePreview"
                            src="/product/image_default.svg"
                            width={100}
                            height={100}
                          />
                        )}
                        <InputFile setFile={setFile} />
                      </div>
                    </div>
                    <div className="w-[60%] text-zinc-500 py-5">
                      <span>
                        Dale a tu producto un título breve y claro. 50-60
                        caracteres es la longitud recomendada para los motores
                        de búsqueda.
                      </span>
                    </div>
                    <Textarea
                      placeholder="Descripcion del producto"
                      value={product.description}
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                    />
                    {Errors.productError && (
                      <p className="text-red-600">{Errors.productError}</p>
                    )}
                  </AccordionItem>
                  <AccordionItem
                    key="Categorie"
                    aria-label="Accordion 2"
                    subtitle="Relaciona tus productos con categorías existentes."
                    indicator={({ isOpen }) =>
                      isOpen ? <Minus className="rotate-90" /> : <Plus />
                    }
                    title="Categorias"
                  >
                    <Select
                      label="Categorias"
                      selectionMode="multiple"
                      placeholder="Seleccione las categorias"
                      className="max-w-[200px] "
                      onChange={handleSelectionChange}
                    >
                      {categories ? (
                        categories?.map((e) => (
                          <SelectItem
                            key={e.name}
                            value={e.name}
                            textValue={e.name}
                          >
                            <div className="flex gap-1">
                              {e.parent_category_id ? (
                                <FiCornerDownRight />
                              ) : (
                                <></>
                              )}
                              {e.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={"defauld"}>
                          <Spinner />
                        </SelectItem>
                      )}
                    </Select>
                    <p className="text-small text-default-500">
                      Seleccionado:{" "}
                      {valuesSelectorCategory?.map((c) => ` ${c.name},`)}
                    </p>
                    {Errors.categoriesError && (
                      <p className="text-red-600">{Errors.categoriesError}</p>
                    )}
                  </AccordionItem>
                  <AccordionItem
                    key="Variaciones"
                    aria-label="Accordion 3"
                    subtitle="opciones y variaciones del producto"
                    indicator={({ isOpen }) =>
                      isOpen ? <Minus className="rotate-90" /> : <Plus />
                    }
                    title="Variaciones"
                  >
                    <ButtonM
                      variant="transparent"
                      className=" border rounded-[5px] mb-5"
                      onClick={handlerAddOption}
                    >
                      Agregar opciones de variacion
                      <Plus />
                    </ButtonM>
                    {Errors.optionVariant && (
                      <p className="text-red-600 py-3">
                        {Errors.optionVariant}
                      </p>
                    )}
                    {optionVariant.length ? (
                      optionVariant.map((optV, i) => (
                        <div key={i}>
                          <ProductOptionVariant
                            objetOptionVariant={optV}
                            setOptionVariant={setOptionVariant}
                            handlerNumberVariant={handlerNumberVariant}
                          />
                        </div>
                      ))
                    ) : (
                      <p>Agregar opciones de variacion</p>
                    )}
                    {Errors.optionVariantTitle && (
                      <p className="text-red-600 py-3">
                        {Errors.optionVariantTitle}
                      </p>
                    )}
                    {Errors.optionVariantItem && (
                      <p className="text-red-600 py-3">
                        {Errors.optionVariantItem}
                      </p>
                    )}

                    {variant.length && optionVariant.length ? (
                      variant.map((v, i) => (
                        <div key={v.index} className="flex gap-2 items-center">
                          <ProductVariat
                            variant={v}
                            optionVariant={optionVariant}
                          />
                          <IconButton
                            onClick={() => handlerTrash(v.index)}
                            className="text-red-700"
                          >
                            <Trash />
                          </IconButton>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                    {Errors.variant && (
                      <p className="text-red-600 py-3">{Errors.variant}</p>
                    )}
                    {Errors.variant_inventory && (
                      <p className="text-red-600 py-3">
                        {Errors.variant_inventory}
                      </p>
                    )}
                    {Errors.variant_prices && (
                      <p className="text-red-600 py-3">
                        {Errors.variant_prices}
                      </p>
                    )}

                    {/* {variant.length <= numberVariant && */}
                    {optionVariant.length ? (
                      <ButtonM
                        variant="transparent"
                        className=" border rounded-[5px] mb-5"
                        onClick={handlerAddVariant}
                      >
                        <Plus />
                        Agegar variacion
                      </ButtonM>
                    ) : (
                      <></>
                    )}
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Guardar producto
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
