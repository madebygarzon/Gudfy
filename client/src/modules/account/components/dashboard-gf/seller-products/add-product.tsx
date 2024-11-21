import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react"
import { Plus, XMark } from "@medusajs/icons"
import { Button as ButtonM } from "@medusajs/ui"
import { Input } from "@nextui-org/react"
import { getListProductVariant } from "../../../actions/get-list-product-variants"
import { AddProductsVariant } from "../../../actions/post-add-product-variant"
import Image from "next/image"
import FileUploader from "./file-uploader-txt"

type Reset = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}
type listProductsVariant = {
  id: string
  product_id: string
  thumbnail: string
  titulo: string
  titleVariant: string
}

type dataSend = {
  variantID: string
  price?: number | undefined
  codes: string[]
  quantity: number
  duplicates:
    | {
        [key: string]: number
      }
    | number
}[]
interface listproducts {
  products: Array<listProductsVariant>
  productsReviwe: Array<listProductsVariant>
  unselectedProducts: Array<listProductsVariant>
  selectedProducts: Array<listProductsVariant>
}
interface CodesResult {
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}
interface ProductPrice {
  variantID: string
  price: number
}

export default function AddProducts({ setReset }: Reset) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [listProducts, setListProducts] = useState<listproducts>({
    products: [],
    productsReviwe: [],
    unselectedProducts: [],
    selectedProducts: [],
  })
  const [addResult, setAddResult] = useState<CodesResult[]>([])
  const [addPrice, setAddPrice] = useState<ProductPrice[]>([])
  const [isloadingPV, setLoadingPV] = useState<boolean>(false)
  const [susccessful, setSusccessful] = useState<boolean>(false)
  const [erros, setErrors] = useState<{
    codes: boolean
    price: boolean
  }>({ codes: true, price: true })

  useEffect(() => {
    if (isOpen)
      getListProductVariant().then((data) => {
        setListProducts({
          products: data,
          productsReviwe: data,
          unselectedProducts: data,
          selectedProducts: [],
        })
        setLoadingPV(false)
        setErrors({ codes: true, price: true })
      })
  }, [isOpen])

  const handlerSearcherbar = (value: string) => {
    if (!value)
      setListProducts((data) => ({
        ...data,
        productsReviwe: data.unselectedProducts,
      }))

    setListProducts((data) => ({
      ...data,
      productsReviwe: data.unselectedProducts.filter(
        (product) =>
          product.titulo.toLowerCase().includes(value.toLowerCase()) ||
          product.titleVariant.toLowerCase().includes(value.toLowerCase())
      ),
    }))
  }
  const handlerAddProduct = (variantID: string) => {
    setSusccessful(false)
    const productAdd = listProducts.unselectedProducts.find(
      (producto) => producto.id === variantID
    )
    if (productAdd)
      setListProducts((data) => ({
        ...data,
        selectedProducts: [...data.selectedProducts, productAdd],
        unselectedProducts: data.unselectedProducts.filter(
          (producto) => producto.id != variantID
        ),
        productsReviwe: data.productsReviwe.filter(
          (producto) => producto.id != variantID
        ),
      }))
  }
  const handlerDeleteProduct = (variantID: string) => {
    const productAdd = listProducts.products.find(
      (producto) => producto.id === variantID
    )
    if (productAdd)
      setListProducts((data) => ({
        ...data,
        unselectedProducts: [...data.unselectedProducts, productAdd],
        selectedProducts: data.selectedProducts.filter(
          (producto) => producto.id != variantID
        ),
        productsReviwe: [productAdd, ...data.productsReviwe],
      }))
    setAddResult((old) => old.filter((result) => result.variantID != variantID))
  }

  const handlerChangePrice = (value: number, variantID: string) => {
    if (addPrice.length) {
      const newArrayPrice = addPrice.map((price) => {
        if (price.variantID === variantID) {
          return { price: value, variantID }
        }
        return price
      })
      setAddPrice(newArrayPrice)
    }
    setAddPrice((addPrice) => [...addPrice, { price: value, variantID }])
  }

  const handlerValidateData = (dataSend: dataSend): boolean => {
    let codes = dataSend.length ? true : false
    let price = dataSend.length ? true : false
    dataSend.forEach((data) => {
      if (!data.price) {
        price = false
      }
    })
    dataSend.forEach((data) => {
      if (!data.codes.length) {
        codes = false
      }
    })

    if (!codes) setErrors((old) => ({ ...old, codes: false }))
    if (!price) setErrors((old) => ({ ...old, price: false }))

    return price && codes
  }

  const onSubmit = () => {
    setLoadingPV(true)

    const dataSend = addResult.map((data) => {
      const dataPrice = addPrice.find(
        (price) => price.variantID === data.variantID
      )
      return { ...data, ...dataPrice }
    })

    if (!handlerValidateData(dataSend)) return setLoadingPV(false)

    AddProductsVariant(dataSend).then(() => {
      setAddResult([])
      setLoadingPV(false)
      setSusccessful(true)
      setListProducts((data) => ({ ...data, selectedProducts: [] }))
      setAddPrice([])
      setReset((reset) => !reset)
    })
  }

  return (
    <>
      <ButtonM
        variant="transparent"
        className=" bg-white hover:bg-gray-100 text-gray-600 border-gray-300 border rounded-[5px]"
        onClick={onOpen}
      >
        Agregar producto
        <Plus />
      </ButtonM>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-20">
                Agregar Productos
              </ModalHeader>
              <ModalBody className="py-2 px-20 ">
                <div className=" flex w-full">
                  <div className="w-[30%]">
                    <Input
                      placeholder="Busca tu producto"
                      id="search-input"
                      type="search"
                      onChange={(e) => handlerSearcherbar(e.target.value)}
                    />
                    {listProducts.products.length ? (
                      <div className=" container my-2 max-h-[70vh] bg-white p-4 border border-slate-200 rounded-[5px] overflow-auto">
                        <table className="">
                          <thead>
                            <tr>
                              <th className="w-1/4 py-2">Lista de productos</th>
                              <th className="w-1/4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {listProducts.productsReviwe ? (
                              listProducts.productsReviwe.map((product) => (
                                <tr key={product.id} className="border-b">
                                  <td
                                    className="py-2 flex justify-start items-center"
                                    colSpan={2}
                                  >
                                    <Image
                                      src={product.thumbnail}
                                      alt={product.titulo}
                                      width={64}
                                      height={64}
                                      className="object-cover mr-3 "
                                    />
                                    <div className="flex flex-col items-start justify-center h-full">
                                      <span className="font-bold">
                                        {product.titulo}
                                      </span>
                                      <span>{product.titleVariant}</span>
                                    </div>
                                  </td>

                                  <td className="py-2 text-center">
                                    <Button
                                      onPress={() =>
                                        handlerAddProduct(product.id)
                                      }
                                    >
                                      Agregar a mi tienda
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <p>
                                <XMark /> No se encontraron datos
                              </p>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-10">
                        <h4>No hay mas productos</h4>
                      </div>
                    )}
                  </div>
                  <div className="w-[70%] pt-8 pl-8">
                    <h2 className="font-bold text-base">
                      Lista de productos seleccionados
                    </h2>
                    {listProducts.selectedProducts.length ? (
                      <table className="">
                        <thead>
                          <tr>
                            <th className="w-1/4 py-2"></th>
                            <th className="w-1/4 py-2"></th>
                            <th className="w-1/4 py-2"></th>
                            <th className="w-1/4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {listProducts.selectedProducts.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-2 flex">
                                <Image
                                  src={product.thumbnail}
                                  alt={product.titulo}
                                  width={64}
                                  height={64}
                                  className="object-cover mr-3 "
                                />
                                <div className="flex flex-col items-start justify-center mx-5 h-full">
                                  <span className="font-bold">
                                    {product.titulo}
                                  </span>
                                  <span>{product.titleVariant}</span>
                                </div>
                              </td>
                              <td className="py-2  text-center ">
                                <FileUploader
                                  variantID={product.id}
                                  setAddResult={setAddResult}
                                />
                              </td>
                              <td className="py-2  text-center ">
                                <Input
                                  label={"Precio"}
                                  type="number"
                                  onChange={(e) => {
                                    handlerChangePrice(
                                      parseFloat(e.target.value),
                                      product.id
                                    )
                                  }}
                                />
                              </td>
                              <td className="py-2  text-center ">
                                {" "}
                                <ButtonM
                                  variant="danger"
                                  onClick={() =>
                                    handlerDeleteProduct(product.id)
                                  }
                                >
                                  {" "}
                                  Eliminar
                                </ButtonM>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="felx justify-center text-center">
                        Agrega un producto de la lista de productos
                      </div>
                    )}
                    {susccessful && (
                      <div className=" flex items-center justify-center font-semibold text-lg text-center text-blue-700 h-full">
                        Productos agregados correctamente{" "}
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="mb-[2%] justify-center">
                <div>
                  {!erros.codes ? (
                    <div>
                      <p className="text-red-600">
                        ** No se an insertado los codigos de algun producto **
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {!erros.price ? (
                    <div>
                      <p className="text-red-600">
                        ** No se an insertado el precio de algun producto **
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex justify-center">
                    <ButtonM
                      variant="transparent"
                      className="text-red-700 border border-red-700"
                      onClick={onClose}
                    >
                      Cancelar
                    </ButtonM>
                    <ButtonM
                      variant="transparent"
                      className="text-blue-700  border border-blue-700"
                      onClick={onSubmit}
                    >
                      {isloadingPV ? (
                        <Spinner color="secondary" />
                      ) : (
                        "Guardar productos"
                      )}
                    </ButtonM>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
