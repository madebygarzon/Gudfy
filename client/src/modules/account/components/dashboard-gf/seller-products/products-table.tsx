import React, { useState, useEffect } from "react"
import { IconButton, Input, Select } from "@medusajs/ui"
import { XMark, ArrowLongRight, ArrowLongLeft } from "@medusajs/icons"
import Spinner from "@modules/common/icons/spinner"
import { getSellerProduct } from "@modules/account/actions/get-seller-product"
import { ProductCategory } from "@medusajs/medusa"
import AddProducts from "./add-product"
import EditProduct from "./edit-product"
import ImagePlaceholderIcon from "@modules/common/icons/defaultIcon"
import getAllCategories from "@modules/account/actions/get-data-categories"
import { PencilEditIcon } from "@lib/util/icons"
import { useDisclosure } from "@nextui-org/react"
import Thumbnail from "@modules/products/components/thumbnail"
import RequestProductTable from "./table-request-products"
import { BsEye, BsViewList } from "react-icons/bs"
import ViewProductSerials from "./view-product-serials"

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
interface serials {
  id: string
  serial: string
  store_variant_order_id: boolean
  store_order_id: string
}

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
  const [productView, setProductView] = useState<StoreProducVariant>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

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

  return productView ? (
    <ViewProductSerials
      productData={productView}
      key={productEdit?.storexvariantid}
      setViewSerial={setProductView}
    />
  ) : (
    <>
      <div className="bg-white p-2 md:p-8 border border-gray-200 rounded-lg">
        <div className="w-full h-full">
          <h2 className="text-xl md:text-2xl mt-2 font-bold text-gray-700">
            Productos de la tienda
          </h2>
          <div className="mt-2 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-[170px]">
                <Input
                  className="w-full bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300"
                  placeholder="Buscar"
                  id="search-input"
                  type="search"
                  onChange={(e) => handlerSearcherbar(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <AddProducts setReset={setReset} />
              <RequestProductTable />
            </div>
          </div>
          {!isLoading && dataProducts.dataPreview.length ? (
            <>
              <div className="overflow-x-auto mt-5">
                <table className="w-full min-w-[600px] md:text-base text-sm">
                  <thead className="bg-gray-50 rounded text-left border-1 border-gray-200">
                    <tr className="shadow-sm">
                      <th className="py-3 px-4">Productos</th>
                      <th className="py-3 px-4">Precio</th>
                      <th className="py-3 px-4">Inventario</th>
                      <th className="py-3 px-4">Categorias</th>
                      <th className="py-3 px-4">Ajustes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProducts.dataPreview?.map((data, i) => {
                      return (
                        <tr
                          key={data.storexvariantid}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="md:py-4 md:px-4  p-1">
                            <div className="flex gap-3 items-center">
                              {data.thumbnail ? (
                                <Thumbnail
                                  thumbnail={data.thumbnail}
                                  size="bsmall"
                                />
                              ) : (
                                <ImagePlaceholderIcon />
                              )}
                              <div className="ml-4">
                                <h3 className="md:text-lg text-sm font-bold text-gray-700">
                                  {` ${data.productvarianttitle} `}
                                </h3>
                                <p className="md:text-sm text-xs text-gray-600">
                                  {` ${data.producttitle} `}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="md:p-4 p-2">$ {data.price} USD</td>
                          <td className="md:p-4 p-2">
                            {data.quantity} Codigos
                          </td>
                          <td className="md:p-4 p-2">GifCars</td>
                          <td className="md:p-4 p-2">
                            <div className="flex items-center gap-2">
                              <IconButton
                                className="hover:bg-gray-100 hover:scale-110 transition-all"
                                variant="transparent"
                                onClick={() => {
                                  setProductEdit(data)
                                  onOpen()
                                }}
                              >
                                <PencilEditIcon />
                              </IconButton>
                              <IconButton
                                className="hover:bg-gray-100 hover:scale-110 transition-all"
                                variant="transparent"
                                onClick={() => {
                                  setProductView(data)
                                }}
                              >
                                <BsEye color="#9b48ed" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : !isLoading && !dataProducts.dataPreview.length ? (
            <div className="flex flex-col justify-center items-center py-10 bg-gray-100 rounded-lg shadow-md mt-4">
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
            <div className="flex justify-center items-center py-10">
              <Spinner />
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center p-4 mt-6 gap-4">
          <div className="flex items-center gap-4 ">
            <p className="md:text-sm text-xs whitespace-nowrap">{`${dataProducts.dataFilter.length} productos`}</p>
            <Select onValueChange={handlerFilterRows} size="small">
              <Select.Trigger className="bg-white text-gray-600">
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
          <div className="flex items-center gap-4 md:text-base text-sm">
            <span>
              {page} de {pageTotal}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page == 1}
                onClick={() => handlerNextPage("PREV")}
                className="disabled:opacity-50"
              >
                <ArrowLongLeft />
              </button>
              <button
                disabled={page == pageTotal}
                onClick={() => handlerNextPage("NEXT")}
                className="disabled:opacity-50"
              >
                <ArrowLongRight />
              </button>
            </div>
          </div>
        </div>
        {productEdit && (
          <EditProduct
            key={productEdit?.storexvariantid}
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            productData={productEdit}
            setReset={setReset}
            onClose={onClose}
          />
        )}
      </div>
    </>
  )
}
