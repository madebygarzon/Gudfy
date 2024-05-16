import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { Plus, XMark } from "@medusajs/icons"
import { Button as ButtonM, FocusModal, IconButton, Input } from "@medusajs/ui"
import { getListProductVariant } from "../../../actions/get-list-product-variants"

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
interface listproducts {
  products: Array<listProductsVariant>
  productsReviwe: Array<listProductsVariant>
  unselectedProducts: Array<listProductsVariant>
  selectedProducts: Array<listProductsVariant>
}

export default function AddProducts({ setReset }: Reset) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [listProducts, setListProducts] = useState<listproducts>({
    products: [],
    productsReviwe: [],
    unselectedProducts: [],
    selectedProducts: [],
  })
  const [filePlane, setFilePlane] = useState<File>()
  const [codes, setCodes] = useState<Array<string>>([])

  const onSubmit = () => {}

  useEffect(() => {
    if (isOpen)
      getListProductVariant().then((data) =>
        setListProducts({
          products: data,
          productsReviwe: data,
          unselectedProducts: data,
          selectedProducts: [],
        })
      )
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
  }

  return (
    <>
      <ButtonM
        variant="transparent"
        className=" border rounded-[5px]"
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
                  <div className="w-[50%]">
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
                                  <td className="py-2 flex">
                                    <img
                                      src={product.thumbnail}
                                      alt={product.titulo}
                                      className="w-16 h-16 object-cover mx-auto"
                                    />
                                    <div className="flex flex-col items-start justify-center h-full">
                                      <span className="font-bold">
                                        {product.titulo}
                                      </span>
                                      <span>{product.titleVariant}</span>
                                    </div>
                                  </td>
                                  <td className="py-2 text-center"></td>
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
                      <p>Ocurrió un error</p>
                    )}
                  </div>
                  <div className="w-[50%] pt-8 pl-8">
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
                          </tr>
                        </thead>
                        <tbody>
                          {listProducts.selectedProducts.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-2 flex">
                                <img
                                  src={product.thumbnail}
                                  alt={product.titulo}
                                  className="w-16 h-16 object-cover mx-auto"
                                />
                                <div className="flex flex-col items-start justify-center h-full">
                                  <span className="font-bold">
                                    {product.titulo}
                                  </span>
                                  <span>{product.titleVariant}</span>
                                </div>
                              </td>
                              <td className="py-2 text-center">
                                <FileUploader
                                  codes={codes}
                                  setCodes={setCodes}
                                />
                              </td>
                              <td className="py-2 text-center">
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
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Guardar productos
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
