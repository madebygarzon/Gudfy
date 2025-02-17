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
import ButtonLigth from "@modules/common/components/button_light"
import RequestProduct from "./request-products"
import { FaBox } from "react-icons/fa6"

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
      <ButtonLigth
        className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
        onClick={onOpen}
      >
        Agregar productos
        <Plus />
      </ButtonLigth>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent className="max-h-screen overflow-y-auto">
          {(onClose) => (
            <>
              <ModalBody className=" m-6 border-1 rounded-xl shadow-md border-gray-200 p-12 ">
                <div className=" flex w-full h-full">
                  <div className="w-[30%] h-full flex flex-col justify-between">
                    <Input
                      placeholder="Buscar un producto"
                      id="search-input"
                      type="search"
                      onChange={(e) => handlerSearcherbar(e.target.value)}
                    />
                    {listProducts.products.length ? (
                      <div className=" container my-2 max-h-[60vh] bg-white p-4 border border-slate-200 rounded-[5px] overflow-auto">
                        <table className="">
                          <thead>
                            <tr>
                              <th className="flex items-start w-full py-2">
                                Productos disponibles
                              </th>
                              <th className="w-2/4 py-2"></th>
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
                                    {/* <Button
                                      onPress={() =>
                                        handlerAddProduct(product.id)
                                      }
                                    >
                                      Agregar a mi tienda
                                    </Button> */}

                                    <ButtonLigth
                                      className="ml-2 bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
                                      onClick={() =>
                                        handlerAddProduct(product.id)
                                      }
                                    >
                                      Agregar <Plus />
                                    </ButtonLigth>
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
                      <div className="py-10 flex gap-2 w-full items-center justify-center">
                        <FaBox size={50} />
                        <h4>No hay más productos</h4>
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <p className="mb-2">¿No encuentras el producto vas a vender?</p>
                      <RequestProduct setReset={setReset} />
                    </div>
                  </div>
                  <div className="w-[70%] pl-8">
                    <h2 className="flex justify-center text-lg">
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
                              <td className="py-2 text-center ">
                                <p className="text-star text-sm">cargar códigos</p>
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
                                <ButtonLigth
                                  className="ml-4 bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                                  onClick={() =>
                                    handlerDeleteProduct(product.id)
                                  }
                                >
                                  Cancelar
                                </ButtonLigth>
                                {/* <ButtonM
                                  variant="danger"
                                  onClick={() =>
                                    handlerDeleteProduct(product.id)
                                  }
                                >
                                  {" "}
                                  Eliminar
                                </ButtonM> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex mt-10 items-center justify-center ">
                        Agrega un producto de la lista de disponibles...
                      </div>
                    )}
                    {susccessful && (
                      <div className=" flex mt-10 justify-center font-semibold text-2xl text-[#218838] h-full">
                        ¡Productos agregados correctamente!{" "}
                      </div>
                    )}

                    <div>
                      {!erros.codes ? (
                        <div>
                          <p className="text-red-600">
                            ** No se han subido códigos a ningún producto **
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {!erros.price ? (
                        <div>
                          <p className="text-red-600 mb-4">
                            ** No se ha asignado precio a ningún producto **
                          </p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      
                    </div>
                    
                  </div>
                  
                </div>
                <div className="flex justify-center gap-2">
                        <ButtonLigth
                          // variant="transparent"
                          className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                          onClick={onClose}
                        >
                          Cancelar
                        </ButtonLigth>
                        <ButtonLigth
                          // variant="transparent"
                          className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                          onClick={onSubmit}
                        >
                          {isloadingPV ? (
                            <Spinner color="secondary" />
                          ) : (
                            "Guardar productos"
                          )}
                        </ButtonLigth>
                      </div>
              </ModalBody>
              <ModalFooter className="mb-[2%] justify-center">
                <div>
                  {!erros.codes ? (
                    <div>
                      <p className="text-red-600">
                        ** No se han insertado códigos a ningún producto **
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {!erros.price ? (
                    <div>
                      <p className="text-red-600 mb-4">
                        ** No se ha asignado precio a ningún producto **
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
