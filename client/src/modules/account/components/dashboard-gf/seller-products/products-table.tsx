import React, { useState, useEffect } from "react"
import { Table, DropdownMenu, IconButton, Input, Select } from "@medusajs/ui"
import {
  PencilSquare,
  XMark,
  ArrowLongRight,
  ArrowLongLeft,
} from "@medusajs/icons"
import Spinner from "@modules/common/icons/spinner"
import { getSellerProduct } from "@modules/account/actions/get-seller-product"
import { ProductCategory } from "@medusajs/medusa"
import RequestProduct from "./request-product"
import AddProducts from "./add-product"
import EditProduct from "./edit-product"
import Image from "next/image"
import Link from "next/link"
import { Variant } from "types/medusa"
import ImagePlaceholderIcon from "@modules/common/icons/defaultIcon"
import getAllCategories from "@modules/account/actions/get-data-categories"
import { PencilEditIcon } from "@lib/util/icons"
import { useDisclosure } from "@nextui-org/react"

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

type ListDataSellerProduct = {
  dataProduct: Array<StoreProducVariant>
  dataFilter: Array<StoreProducVariant>
  dataPreview: Array<StoreProducVariant>
  count: number
}
const dataSelecterPAge = [10, 20, 30]
const dataSelecFilter = [
  {
    value: "todos",
    label: "Todos",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "published",
    label: "Published",
  },
]
export default function ProductsTable() {
  const [dataProducts, setDataProducts] = useState<ListDataSellerProduct>({
    dataProduct: [],
    dataPreview: [],
    dataFilter: [],
    count: 0,
  })

  //Control de paginacion para los productos
  const [pageTotal, setPagetotal] = useState<number>() // paginas totales
  const [page, setPage] = useState(1)
  const [rowsPerPages, setRowsPerPages] = useState(dataSelecterPAge[0]) // numero de filas por pagina
  const [reset, setReset] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<ProductCategory[]>()

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
  //------------------------------------------
  const handlerGetListProduct = async () => {
    const dataProduct = await getSellerProduct().then((e) => {
      if (e) {
        setPagetotal(Math.ceil(e[1] / rowsPerPages))
        setDataProducts({
          dataProduct: e,
          dataFilter: e,
          dataPreview: handlerPreviewProducts(e, 1),
          count: e.length,
        })
      }
      setLoading(false)
    })
  }

  const handlerNextPage = (action: any) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataProducts.dataFilter!) {
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataFilter,
              page + 1
            ),
          })
          return old + 1
        } else
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataProduct,
              page + 1
            ),
          })

        return old + 1
      })

    if (action == "PREV")
      setPage((old) => {
        if (dataProducts.dataFilter!) {
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataFilter,
              page - 1
            ),
          })
          return old - 1
        } else
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataProduct,
              page - 1
            ),
          })

        return old - 1
      })
  }

  const handlerPreviewProducts = (queryParams: any, page: any, rows?: any) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    if (!Array.isArray(queryParams)) return []
    const dataRowPage = rows || rowsPerPages
    const start = (page - 1) * dataRowPage
    const end = page * dataRowPage
    const newArray = queryParams.slice(start, end)
    setPagetotal(Math.ceil(queryParams.length / dataRowPage))
    return newArray
  }

  useEffect(() => {
    setLoading(true)
    handlerGetListProduct()
    // categoriesOrder()
  }, [reset])

  const handlerFilterRows = (value: any) => {
    const valueInt = parseInt(value)
    setRowsPerPages(valueInt)
    setDataProducts({
      ...dataProducts,
      dataPreview: handlerPreviewProducts(
        dataProducts.dataFilter ?? dataProducts.dataProduct,
        1,
        valueInt
      ),
    })
  }

  // Controller from Edit Product
  const [productEdit, setProductEdit] = useState<StoreProducVariant>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const handlerEditProduct = (product: StoreProducVariant) => {
    setProductEdit(product)
    onOpen()
  }
  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataProducts.dataProduct.filter((data) => {
      const nameIncludes = data.producttitle
        .toLowerCase()
        .includes(e.toLowerCase())

      return nameIncludes
    })
    setDataProducts({
      ...dataProducts,
      dataPreview: handlerPreviewProducts(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    })
  }

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <h1 className=" text-xl font-bold">Productos de la tienda</h1>
        <div className="mt-2 flex justify-between">
          <div className="flex gap-5 h-full items-end py-4">
            <div className="w-[170px] ">
              <Input
                className="flex items-center justify-center bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300 "
                placeholder="Buscar"
                id="search-input"
                type="search"
                onChange={(e) => handlerSearcherbar(e.target.value)}
              />
            </div>
            
          </div>

          <div className="flex itmes-end py-4 gap-x-3">
            <AddProducts setReset={setReset} />
            <RequestProduct setReset={setReset} />
          </div>
        </div>
        {!isLoading && dataProducts.dataPreview.length ? (
          <>
            <table className="table w-full">
              <thead className="heade_table rounded text-left border-1 border-gray-200">
                <tr className="table_header  shadow-sm border-[15px] border-white">
                  <th className="my-8">Producto</th>
                  <th>Precio</th>
                  <th>Inventario</th>
                  <th>Categorias</th>
                  <th>Ajustes</th>
                </tr>
              </thead>
              <tbody className="heade_body">
                {dataProducts.dataPreview?.map((data, i) => {
                  return (
                    <tr
                      key={data.storexvariantid}
                      onClick={() => handlerEditProduct(data)}
                      className="cursor-pointer my-6 "
                    >
                      <td>
                        <div className="flex gap-3 items-center">
                          {data.thumbnail ? (
                            <Image
                              src={data.thumbnail}
                              width={28}
                              height={38}
                              alt={data.producttitle}
                            />
                          ) : (
                            <ImagePlaceholderIcon />
                          )}
                          {` ${data.productvarianttitle} `}
                        </div>
                      </td>
                      <td> $ {data.price} USD</td>
                      <td>{data.quantity} Codigos</td>
                      <td>GifCars</td>
                      <td>
                        <IconButton
                          className="hover:bg-white hover:text-white hover:scale-110 transition-all"
                          variant="transparent"
                          onClick={() => onOpen()}
                        >
                          <PencilEditIcon />
                        </IconButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        ) : !isLoading && !dataProducts.dataPreview.length ? (
          <div className="flex flex-col justify-center items-center py-10 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <XMark className="h-6 w-6" />
              <p className="text-lg font-semibold">
                No tienes productos en tu tienda
              </p>
            </div>
            <p className="text-gray-600 mt-2 text-center">
              Por favor, agrega tus productos para comenzar a vender.
            </p>
          </div>
        ) : (
          <Spinner />

        )}
      </div>
      <div className="flex justify-between p-4 mt-6">
        <div>
          {`${dataProducts.dataFilter.length} Productos`}{" "}
          <Select onValueChange={handlerFilterRows} size="small">
            <Select.Trigger className="bg-white mt-4 text-[#C2C2C2] text-gra-200">
              <Select.Value placeholder="10" />
            </Select.Trigger>
            <Select.Content>
              {dataSelecterPAge.map((item) => (
                <Select.Item key={item} value={`${item}`}>
                  {item}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="flex gap-5">
          <>
            {page} de {pageTotal}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == pageTotal ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
      {productEdit ? (
        <EditProduct
          key={productEdit?.storexvariantid}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          productData={productEdit}
          setReset={setReset}
          onClose={onClose}
        />
      ) : (
        <></>
      )}

      <span></span>
    </div>
  )
}
